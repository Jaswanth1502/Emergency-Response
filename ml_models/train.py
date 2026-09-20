"""
Training Runner for Unified Emergency Response Multi-Task Transformer
========================================================================
Executes model training, logs per-epoch multi-task metrics, and exports weights.
"""

import sys
import os
import json

# Ensure current script directory is in Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import torch
from torch.utils.data import DataLoader

from unified_transformer import (
    Config,
    UnifiedEmergencyResponseTransformer,
    MultiTaskLoss,
    EmergencyDataset,
    INCIDENT_NAMES,
    SEVERITY_NAMES,
    RESOURCE_NAMES,
    predict
)

def train_one_epoch(model, dataloader, optimizer, criterion, device):
    model.train()
    total_loss = 0.0

    for x, targets in dataloader:
        x = x.to(device)
        targets = {k: v.to(device) for k, v in targets.items()}

        optimizer.zero_grad()
        predictions = model(x)
        losses = criterion(predictions, targets)
        loss = losses["total"]

        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(dataloader)


@torch.no_grad()
def evaluate(model, dataloader, criterion, device):
    model.eval()
    total_loss = 0.0
    correct_incident, correct_severity, total_samples = 0, 0, 0
    total_risk_mae, total_trapped_mae, total_hospital_mae = 0.0, 0.0, 0.0

    for x, targets in dataloader:
        x = x.to(device)
        targets = {k: v.to(device) for k, v in targets.items()}

        predictions = model(x)
        losses = criterion(predictions, targets)
        total_loss += losses["total"].item()

        inc_preds = torch.argmax(predictions["incident_logits"], dim=1)
        sev_preds = torch.argmax(predictions["severity_logits"], dim=1)

        correct_incident += (inc_preds == targets["incident"]).sum().item()
        correct_severity += (sev_preds == targets["severity"]).sum().item()
        
        total_risk_mae += torch.abs(predictions["risk_score"].squeeze(-1) - targets["risk"]).sum().item()
        total_trapped_mae += torch.abs(predictions["trapped_person_priority"].squeeze(-1) - targets["trapped_person"]).sum().item()
        total_hospital_mae += torch.abs(predictions["hospital_surge"].squeeze(-1) - targets["hospital_surge"]).sum().item()

        total_samples += targets["incident"].size(0)

    return {
        "loss": total_loss / len(dataloader),
        "incident_accuracy": correct_incident / total_samples,
        "severity_accuracy": correct_severity / total_samples,
        "risk_mae": total_risk_mae / total_samples,
        "trapped_mae": total_trapped_mae / total_samples,
        "hospital_mae": total_hospital_mae / total_samples
    }


def main():
    print("================================================================")
    print(" UNIFIED EMERGENCY RESPONSE MULTI-TASK TRANSFORMER TRAINING")
    print("================================================================")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    train_dataset = EmergencyDataset(num_samples=6000, sequence_length=20)
    val_dataset = EmergencyDataset(num_samples=1200, sequence_length=20)

    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

    model = UnifiedEmergencyResponseTransformer().to(device)
    criterion = MultiTaskLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-4, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=15)

    epochs = 15
    best_val_loss = float("inf")
    metrics_history = []

    for epoch in range(epochs):
        train_loss = train_one_epoch(model, train_loader, optimizer, criterion, device)
        val_metrics = evaluate(model, val_loader, criterion, device)
        scheduler.step()

        inc_acc = val_metrics['incident_accuracy'] * 100
        sev_acc = val_metrics['severity_accuracy'] * 100

        print(
            f"Epoch {epoch + 1:02d}/{epochs:02d} | "
            f"Train Loss: {train_loss:.4f} | "
            f"Val Loss: {val_metrics['loss']:.4f} | "
            f"Incident Acc: {inc_acc:.2f}% | "
            f"Severity Acc: {sev_acc:.2f}% | "
            f"Risk MAE: {val_metrics['risk_mae']:.4f}"
        )

        metrics_history.append({
            "epoch": epoch + 1,
            "train_loss": train_loss,
            "val_loss": val_metrics['loss'],
            "incident_accuracy": inc_acc,
            "severity_accuracy": sev_acc
        })

        if val_metrics['loss'] < best_val_loss:
            best_val_loss = val_metrics['loss']
            save_path = os.path.join(os.path.dirname(__file__), "best_emergency_transformer.pth")
            torch.save({
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "epoch": epoch + 1,
                "validation_loss": val_metrics['loss'],
                "incident_accuracy": inc_acc,
                "severity_accuracy": sev_acc
            }, save_path)
            print(f"  --> Saved checkpoint: {save_path}")

    # Export Metadata JSON
    meta_path = os.path.join(os.path.dirname(__file__), "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump({
            "id": "ML-UNIFIED-10",
            "name": "Unified Emergency Response Multi-Task Transformer",
            "architecture": "6-Layer Shared Transformer Backbone (256d, 8-Heads)",
            "incident_accuracy": round(metrics_history[-1]["incident_accuracy"], 2),
            "severity_accuracy": round(metrics_history[-1]["severity_accuracy"], 2),
            "num_task_heads": 7,
            "trained_epochs": epochs,
            "device": str(device),
            "tasks": [
                "Incident Classification (10 classes)",
                "Severity Classification (4 classes)",
                "Continuous Risk Score Prediction",
                "Trapped Person Priority Ranking",
                "Multi-Label Emergency Resource Allocation",
                "Hospital Surge Load Forecasting",
                "Sensor Anomaly Detection"
            ]
        }, f, indent=2)

    print("\n================================================================")
    print(f" TRAINING COMPLETE! Final Incident Accuracy: {metrics_history[-1]['incident_accuracy']:.2f}%")
    print("================================================================")

if __name__ == "__main__":
    main()
