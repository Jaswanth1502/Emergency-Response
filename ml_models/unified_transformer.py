"""
Unified Emergency Response Multi-Task Transformer
=================================================

Project: Emergency Response Digital Twin Ecosystem with
Autonomous Coordination Agents and Predictive Resource Allocation

Framework: PyTorch
Model: 7-Task Shared-Backbone Multi-Task Transformer
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from typing import Dict, List, Tuple, Any


# ============================================================
# 1. MODEL CONFIGURATION
# ============================================================

class Config:
    INPUT_DIM = 64
    D_MODEL = 256
    N_HEADS = 8
    NUM_LAYERS = 6
    FF_DIM = 1024
    DROPOUT = 0.1
    MAX_SEQUENCE_LENGTH = 128

    NUM_INCIDENT_CLASSES = 10
    NUM_SEVERITY_CLASSES = 4
    NUM_RESOURCE_CLASSES = 6


INCIDENT_NAMES = [
    "NORMAL",
    "FIRE",
    "FLOOD",
    "EARTHQUAKE",
    "LANDSLIDE",
    "CYCLONE",
    "GAS_LEAK",
    "BUILDING_COLLAPSE",
    "ROAD_ACCIDENT",
    "CROWD_EMERGENCY"
]

SEVERITY_NAMES = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
]

RESOURCE_NAMES = [
    "AMBULANCE",
    "FIRE_SERVICE",
    "POLICE",
    "RESCUE_TEAM",
    "MEDICAL_TEAM",
    "HAZARD_GAS_TEAM"
]


# ============================================================
# 2. POSITIONAL ENCODING (WITH BOUND SAFE SENSING)
# ============================================================

class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_length: int = 128):
        super().__init__()
        self.max_length = max_length
        self.position_embedding = nn.Parameter(
            torch.randn(1, max_length, d_model) * 0.02
        )

    def forward(self, x):
        seq_len = x.size(1)
        if seq_len > self.max_length:
            # Interpolate positional embeddings if sequence length exceeds max_length
            pos_emb = F.interpolate(
                self.position_embedding.transpose(1, 2),
                size=seq_len,
                mode='linear',
                align_corners=False
            ).transpose(1, 2)
            return x + pos_emb
        return x + self.position_embedding[:, :seq_len, :]


# ============================================================
# 3. UNIFIED EMERGENCY RESPONSE TRANSFORMER ARCHITECTURE
# ============================================================

class UnifiedEmergencyResponseTransformer(nn.Module):
    def __init__(
        self,
        input_dim=Config.INPUT_DIM,
        d_model=Config.D_MODEL,
        nhead=Config.N_HEADS,
        num_layers=Config.NUM_LAYERS,
        ff_dim=Config.FF_DIM,
        dropout=Config.DROPOUT,
        max_sequence_length=Config.MAX_SEQUENCE_LENGTH,
        num_incident_classes=Config.NUM_INCIDENT_CLASSES,
        num_severity_classes=Config.NUM_SEVERITY_CLASSES,
        num_resource_classes=Config.NUM_RESOURCE_CLASSES
    ):
        super().__init__()

        # Input Projection Layer
        self.input_projection = nn.Sequential(
            nn.Linear(input_dim, d_model),
            nn.LayerNorm(d_model),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        # Positional / Temporal Encoding
        self.position_encoding = PositionalEncoding(
            d_model=d_model,
            max_length=max_sequence_length
        )

        # Transformer Encoder Backbone
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=ff_dim,
            dropout=dropout,
            activation="gelu",
            batch_first=True,
            norm_first=True
        )

        self.transformer = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers
        )

        # Hybrid Temporal Feature Representation (Mean + Max Pooling)
        self.feature_norm = nn.LayerNorm(d_model * 2)
        self.feature_reducer = nn.Linear(d_model * 2, d_model)

        # Task Head 1: Incident Classification (10 classes)
        self.incident_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, num_incident_classes)
        )

        # Task Head 2: Severity Classification (4 classes)
        self.severity_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, num_severity_classes)
        )

        # Task Head 3: Risk Score Prediction (Continuous [0, 1])
        self.risk_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

        # Task Head 4: Trapped Person Priority (Continuous [0, 1])
        self.trapped_person_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

        # Task Head 5: Resource Requirements (Multi-label Logits)
        self.resource_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, num_resource_classes)
        )

        # Task Head 6: Hospital Surge Prediction (Bounded [0, 1])
        self.hospital_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

        # Task Head 7: Sensor Anomaly Detection (Logits)
        self.anomaly_head = nn.Sequential(
            nn.Linear(d_model, 128),
            nn.GELU(),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        x = self.input_projection(x)
        x = self.position_encoding(x)
        x = self.transformer(x)

        # Hybrid Temporal Pooling (Mean + Max over sequence length)
        mean_pool = x.mean(dim=1)
        max_pool = x.max(dim=1)[0]
        combined = torch.cat([mean_pool, max_pool], dim=-1)

        features = self.feature_norm(combined)
        features = F.gelu(self.feature_reducer(features))

        return {
            "incident_logits": self.incident_head(features),
            "severity_logits": self.severity_head(features),
            "risk_score": self.risk_head(features),
            "trapped_person_priority": self.trapped_person_head(features),
            "resource_logits": self.resource_head(features),
            "hospital_surge": self.hospital_head(features),
            "anomaly_logits": self.anomaly_head(features)
        }


# ============================================================
# 4. MULTI-TASK LOSS FUNCTION
# ============================================================

class MultiTaskLoss(nn.Module):
    def __init__(self):
        super().__init__()
        self.incident_loss = nn.CrossEntropyLoss()
        self.severity_loss = nn.CrossEntropyLoss()
        self.risk_loss = nn.MSELoss()
        self.trapped_person_loss = nn.MSELoss()
        self.hospital_loss = nn.MSELoss()
        self.resource_loss = nn.BCEWithLogitsLoss()
        self.anomaly_loss = nn.BCEWithLogitsLoss()

    def forward(self, predictions, targets):
        loss_incident = self.incident_loss(predictions["incident_logits"], targets["incident"])
        loss_severity = self.severity_loss(predictions["severity_logits"], targets["severity"])
        loss_risk = self.risk_loss(predictions["risk_score"].squeeze(-1), targets["risk"])
        loss_trapped = self.trapped_person_loss(predictions["trapped_person_priority"].squeeze(-1), targets["trapped_person"])
        loss_resource = self.resource_loss(predictions["resource_logits"], targets["resources"])
        loss_hospital = self.hospital_loss(predictions["hospital_surge"].squeeze(-1), targets["hospital_surge"])
        loss_anomaly = self.anomaly_loss(predictions["anomaly_logits"].squeeze(-1), targets["anomaly"])

        total_loss = (
            1.2 * loss_incident +
            1.0 * loss_severity +
            0.8 * loss_risk +
            0.8 * loss_trapped +
            1.0 * loss_resource +
            0.5 * loss_hospital +
            0.5 * loss_anomaly
        )

        return {
            "total": total_loss,
            "incident": loss_incident,
            "severity": loss_severity,
            "risk": loss_risk,
            "trapped": loss_trapped,
            "resources": loss_resource,
            "hospital": loss_hospital,
            "anomaly": loss_anomaly
        }


# ============================================================
# 5. CAUSAL SYNTHETIC DATASET GENERATOR
# ============================================================

class EmergencyDataset(Dataset):
    def __init__(self, num_samples=6000, sequence_length=20, input_dim=Config.INPUT_DIM):
        super().__init__()
        self.num_samples = num_samples
        self.sequence_length = sequence_length
        self.input_dim = input_dim

        X = torch.zeros(num_samples, sequence_length, input_dim)

        incidents = torch.zeros(num_samples, dtype=torch.long)
        severities = torch.zeros(num_samples, dtype=torch.long)
        risks = torch.zeros(num_samples)
        trapped = torch.zeros(num_samples)
        resources = torch.zeros(num_samples, Config.NUM_RESOURCE_CLASSES)
        hospital = torch.zeros(num_samples)
        anomalies = torch.zeros(num_samples)

        for i in range(num_samples):
            seq = torch.randn(sequence_length, input_dim) * 0.1
            
            inc_type = torch.randint(0, Config.NUM_INCIDENT_CLASSES, (1,)).item()
            incidents[i] = inc_type

            intensity = torch.rand(1).item() * 0.8 + 0.2
            
            if inc_type == 1:  # FIRE
                seq[:, 0] += intensity * 2.5  # Temp
                seq[:, 1] += intensity * 3.0  # Smoke
                resources[i, 1] = 1.0  # Fire Service
                resources[i, 0] = 1.0 if intensity > 0.5 else 0.0  # Ambulance

            elif inc_type == 2:  # FLOOD
                seq[:, 3] += intensity * 3.5  # Water depth
                seq[:, 6] += intensity * 1.5  # Rain/Wind
                resources[i, 3] = 1.0  # Rescue Team
                resources[i, 4] = 1.0  # Medical Team

            elif inc_type == 3:  # EARTHQUAKE
                seq[:, 2] += intensity * 4.0  # Seismic PGA
                seq[:, 5] += intensity * 2.5  # Structural stress
                resources[i, 3] = 1.0  # Rescue Team
                resources[i, 2] = 1.0  # Police
                resources[i, 0] = 1.0  # Ambulance

            elif inc_type == 6:  # GAS LEAK
                seq[:, 4] += intensity * 3.8  # Gas LEL
                resources[i, 5] = 1.0  # Hazard/Gas Team
                resources[i, 1] = 1.0  # Fire Service

            elif inc_type == 7:  # BUILDING COLLAPSE
                seq[:, 2] += intensity * 2.0  # Vibration
                seq[:, 5] += intensity * 4.0  # Structural collapse
                resources[i, 3] = 1.0  # Rescue Team
                resources[i, 4] = 1.0  # Medical Team

            elif inc_type == 8:  # ROAD ACCIDENT
                seq[:, 7] += intensity * 3.0  # Traffic drop
                resources[i, 0] = 1.0  # Ambulance
                resources[i, 2] = 1.0  # Police

            elif inc_type == 9:  # CROWD EMERGENCY
                seq[:, 8] += intensity * 3.2  # Crowd density
                resources[i, 2] = 1.0  # Police
                resources[i, 0] = 1.0  # Ambulance

            # Determine Severity
            if intensity < 0.35:
                sev = 0
            elif intensity < 0.6:
                sev = 1
            elif intensity < 0.8:
                sev = 2
            else:
                sev = 3
            severities[i] = sev

            # Target values
            risks[i] = torch.clamp(torch.tensor(intensity * 0.9 + 0.05 + torch.randn(1).item() * 0.02), 0.0, 1.0)
            trapped[i] = 0.9 if inc_type in [3, 7] and sev >= 2 else (0.4 if sev >= 2 else 0.1)
            hospital[i] = torch.clamp(torch.tensor(intensity * 0.85 + sev * 0.05), 0.0, 1.0)
            
            # Anomaly injection (5% probability)
            if torch.rand(1).item() < 0.05:
                seq[torch.randint(0, sequence_length, (1,)).item(), :] += 10.0
                anomalies[i] = 1.0

            X[i] = seq

        self.X = X
        self.incident = incidents
        self.severity = severities
        self.risk = risks
        self.trapped_person = trapped
        self.resources = resources
        self.hospital_surge = hospital
        self.anomaly = anomalies

    def __len__(self):
        return self.num_samples

    def __getitem__(self, index):
        return self.X[index], {
            "incident": self.incident[index],
            "severity": self.severity[index],
            "risk": self.risk[index],
            "trapped_person": self.trapped_person[index],
            "resources": self.resources[index],
            "hospital_surge": self.hospital_surge[index],
            "anomaly": self.anomaly[index]
        }


# ============================================================
# 6. INFERENCE PREDICTION UTILITY FUNCTION
# ============================================================

@torch.no_grad()
def predict(model: nn.Module, x: torch.Tensor, device: torch.device) -> Dict[str, Any]:
    """
    Run multi-task inference for a single input sequence.
    
    Args:
        model: Trained UnifiedEmergencyResponseTransformer instance
        x: Input tensor of shape (1, sequence_length, input_dim)
        device: torch.device instance ('cpu' or 'cuda')
    """
    model.eval()
    x = x.to(device)
    outputs = model(x)

    incident_probs = F.softmax(outputs["incident_logits"], dim=-1)
    incident_idx = torch.argmax(incident_probs, dim=-1).item()

    severity_probs = F.softmax(outputs["severity_logits"], dim=-1)
    severity_idx = torch.argmax(severity_probs, dim=-1).item()

    resource_probs = torch.sigmoid(outputs["resource_logits"])
    anomaly_prob = torch.sigmoid(outputs["anomaly_logits"]).item()

    required_resources = [
        RESOURCE_NAMES[i]
        for i in range(Config.NUM_RESOURCE_CLASSES)
        if resource_probs[0, i].item() >= 0.5
    ]

    return {
        "incident": INCIDENT_NAMES[incident_idx],
        "incident_confidence": incident_probs[0, incident_idx].item(),
        "severity": SEVERITY_NAMES[severity_idx],
        "severity_confidence": severity_probs[0, severity_idx].item(),
        "risk_score": outputs["risk_score"][0].item(),
        "trapped_person_priority": outputs["trapped_person_priority"][0].item(),
        "required_resources": required_resources,
        "hospital_surge_percentage": outputs["hospital_surge"][0].item() * 100.0,
        "anomaly_score": anomaly_prob
    }


# ============================================================
# 7. STANDALONE MODULE TEST RUNNER
# ============================================================

if __name__ == "__main__":
    print("Testing Unified Emergency Response Multi-Task Transformer module...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = UnifiedEmergencyResponseTransformer().to(device)
    
    dummy_input = torch.randn(1, 20, Config.INPUT_DIM)
    result = predict(model, dummy_input, device)
    
    print("\n--- SAMPLE INFERENCE OUTPUT ---")
    for key, val in result.items():
        if isinstance(val, float):
            print(f"  {key}: {val:.4f}")
        else:
            print(f"  {key}: {val}")
    print("\n[OK] Model module verified successfully.")
