# Google Colab Cell Structure Guide

## Overview

The training code has been organized into **9 separate cells** for maximum flexibility and ease of use. Each cell has a specific purpose and can be run independently (with dependencies).

---

## 📋 Complete Cell Breakdown

### Cell 1: Setup & Installation (30 seconds)
**Purpose:** Install packages and import libraries

**What it does:**
- Installs TensorFlow Hub and Pillow
- Imports all required libraries
- Checks TensorFlow version
- Verifies GPU availability

**When to run:**
- Always first
- After runtime restart
- When switching notebooks

**Can modify:** ❌ No need to change

---

### Cell 2: Mount Drive & Verify Dataset (10 seconds)
**Purpose:** Connect to Google Drive and verify dataset

**What it does:**
- Mounts Google Drive
- Sets up file paths
- Counts images in each folder
- Verifies dataset exists

**When to run:**
- After Cell 1
- When Drive disconnects
- To verify dataset location

**Can modify:** ✅ Yes - update paths if different folder structure

---

### Cell 3: Organize Dataset & Visualize (2-5 minutes)
**Purpose:** Split data and show samples

**What it does:**
- Creates train/val/test directories
- Copies images with 70/15/15 split
- Shows split statistics
- Displays 16 sample images

**When to run:**
- **Once only** - Don't rerun unless you want to re-split
- Takes 2-5 minutes to copy all files
- Creates random split (seed=42 for reproducibility)

**Can modify:** ✅ Yes - change split percentages if needed

**⚠️ Important:** Running this cell multiple times will re-split your data with different random distributions!

---

### Cell 4: Configure & Prepare Data (10 seconds)
**Purpose:** Set hyperparameters and create data generators

**What it does:**
- Defines image size (224x224)
- Sets batch size (16)
- Sets max epochs (100)
- Sets learning rate (0.001)
- Creates data augmentation
- Prepares train/val/test generators

**When to run:**
- After Cell 3
- **Anytime you want to change settings**
- Before retraining with different parameters

**Can modify:** ✅ Yes - This is where you tune hyperparameters!

**Common modifications:**
```python
BATCH_SIZE = 8      # Reduce if out of memory
EPOCHS = 50         # Reduce for faster training
LEARNING_RATE = 0.0005  # Adjust for different convergence
```

---

### Cell 5: Build & Compile Model (5 seconds)
**Purpose:** Create model architecture and set up training

**What it does:**
- Creates MobileNetV2 base model
- Adds custom classification layers
- Compiles model with optimizer
- Sets up training callbacks
- Shows model summary

**When to run:**
- After Cell 4
- When rebuilding model from scratch
- After changing architecture

**Can modify:** ✅ Yes - Change model architecture or callbacks

**Alternative models:**
```python
# For higher accuracy (heavier model):
model, base_model = create_model('efficientnet')

# For even higher accuracy (much heavier):
model, base_model = create_model('resnet')
```

---

### Cell 6: Train Phase 1 (15-30 minutes)
**Purpose:** Train model with frozen base layers

**What it does:**
- Trains for up to 20 epochs
- Uses frozen pre-trained weights
- Saves best model checkpoints
- Shows training progress
- Auto-stops if no improvement

**When to run:**
- After Cell 5
- Every time you want to train from scratch
- Expected time: 15-30 minutes

**Can modify:** ✅ Yes - Change initial epochs

**⏸️ Can interrupt:** Yes - Best model is saved, you can load it later

---

### Cell 7: Train Phase 2 & Evaluate (20-60 minutes)
**Purpose:** Fine-tune model and test performance

**What it does:**
- Unfreezes last 30 layers
- Fine-tunes with lower learning rate
- Continues training from Phase 1
- Evaluates on test set
- Reports all metrics

**When to run:**
- After Cell 6 completes
- For final model optimization
- Expected time: 20-60 minutes

**Can modify:** ✅ Yes - Change number of unfrozen layers

**⏸️ Can interrupt:** Yes - Best model is saved automatically

---

### Cell 8: Visualize & Test (30 seconds)
**Purpose:** Review training and test predictions

**What it does:**
- Plots training/validation curves
- Shows accuracy and loss graphs
- Tests on 6 random images
- Displays predictions vs true labels

**When to run:**
- After Cell 7
- **Anytime after training** to review results
- Quick check: 30 seconds

**Can modify:** ✅ Yes - Change number of test samples

**Can skip:** ✅ Yes - Optional visualization step

---

### Cell 9: Export & Save (1-2 minutes)
**Purpose:** Convert model and save to Drive

**What it does:**
- Saves full Keras model (.h5)
- Converts to TensorFlow Lite (.tflite)
- Creates metadata JSON
- Saves all files to Google Drive
- Shows download instructions

**When to run:**
- After Cell 7 or 8
- **Essential** - This gives you the mobile model!
- Can rerun anytime to re-export

**Can modify:** ❌ No need to change

**Output location:** `MyDrive/EGourd/Model_Versions/Version_MM-DD-YYYY_N/`

**Naming convention:**
- Format: `Version_10-30-2025_1` (date + counter)
- Always includes version number: `_1`, `_2`, `_3`, etc.
- Counter auto-increments for multiple trainings on same day
- Starts at 1, never skips numbers

**Files generated:**
- ⭐⭐⭐ `ampalaya_classifier.tflite` - For Expo app
- ⭐⭐⭐ `model_metadata.json` - For Expo app  
- ⭐⭐ `ampalaya_classifier.h5` - Backup for retraining
- ⭐⭐ `best_model.h5` - Best checkpoint backup
- ⭐ `training_history.png` - Documentation
- ⭐ `sample_images.png` - Documentation

---

## 🔄 Common Workflows

### First Time Training (Full Run)
```
Cell 1 → Cell 2 → Cell 3 → Cell 4 → Cell 5 → Cell 6 → Cell 7 → Cell 8 → Cell 9
Total: 35-90 minutes
```

### Changing Hyperparameters and Retraining
```
Cell 4 (modify) → Cell 5 → Cell 6 → Cell 7 → Cell 8 → Cell 9
Total: 35-90 minutes
```

### Just Export Previously Trained Model
```
Cell 1 → Cell 2 → Cell 9
Total: 2-3 minutes
```

### Check Results After Training
```
Cell 1 → Cell 2 → Cell 8
Total: 1 minute
```

### Resume After Disconnection
```
Cell 1 → Cell 2 → Cell 7 (if interrupted) → Cell 8 → Cell 9
Time: Depends on where you left off
```

---

## 🎯 Cell Dependencies

```
Cell 1 (Setup)
  ↓
Cell 2 (Mount Drive)
  ↓
Cell 3 (Organize Data) ←─── Run once only!
  ↓
Cell 4 (Configure) ←──────── Modify here for settings
  ↓
Cell 5 (Build Model)
  ↓
Cell 6 (Train Phase 1)
  ↓
Cell 7 (Train Phase 2)
  ↓
Cell 8 (Visualize) ←──────── Optional
  ↓
Cell 9 (Export) ←─────────── Get your .tflite file!
```

---

## ⚙️ Customization Guide

### Want faster training?
**Modify Cell 4:**
```python
BATCH_SIZE = 32  # Increase (if GPU allows)
EPOCHS = 50      # Reduce max epochs
```

### Want better accuracy?
**Modify Cell 4:**
```python
# More augmentation
rotation_range=50
zoom_range=0.4
```

**Modify Cell 5:**
```python
# Use better model
model, base_model = create_model('efficientnet')
```

### Out of memory?
**Modify Cell 4:**
```python
BATCH_SIZE = 8   # Reduce batch size
```

### Want different data split?
**Modify Cell 3:**
```python
train_idx = int(0.80 * total)  # 80% train
val_idx = int(0.90 * total)     # 10% val, 10% test
```

---

## 🚨 Important Warnings

### ⚠️ Don't rerun Cell 3 unnecessarily!
- It will re-split your data randomly
- Your train/val/test sets will change
- Previous results won't be comparable
- Takes 2-5 minutes to re-copy files

### ⚠️ Variables persist between cells!
- Each cell can access variables from previous cells
- Don't skip required cells
- If you get "NameError", rerun earlier cells

### ⚠️ GPU can disconnect!
- Free Colab has time limits
- Keep browser tab active
- Best models are saved automatically
- Can resume from checkpoints

---

## 💡 Pro Tips

### Tip 1: Use Shift+Enter
Press `Shift+Enter` to run current cell and move to next one automatically.

### Tip 2: Monitor GPU usage
Add this to any cell to check GPU:
```python
!nvidia-smi
```

### Tip 3: Save important outputs
Right-click on plots → Save image

### Tip 4: Test quickly before full training
Modify Cell 6 for testing:
```python
epochs=2  # Just test 2 epochs
```

### Tip 5: Multiple experiments
After training, modify Cell 4 and rerun 4-9 to compare different settings.

---

## 🎓 Learning from Each Cell

### Cell 1 teaches:
- Package management in Colab
- Checking hardware availability

### Cell 2 teaches:
- Google Drive integration
- Path management
- File verification

### Cell 3 teaches:
- Dataset organization
- Train/val/test splitting
- Data visualization

### Cell 4 teaches:
- Hyperparameter configuration
- Data augmentation techniques
- Generator patterns

### Cell 5 teaches:
- Transfer learning setup
- Model architecture design
- Training callbacks

### Cells 6 & 7 teach:
- Two-phase training strategy
- Fine-tuning techniques
- Monitoring training progress

### Cell 8 teaches:
- Performance visualization
- Model evaluation
- Prediction testing

### Cell 9 teaches:
- Model export formats
- Mobile optimization
- File management

---

## 📊 Expected Output Summary

| Cell | Key Output | What to Look For |
|------|-----------|------------------|
| 1 | GPU confirmation | Should show GPU:0 |
| 2 | Image counts | 507 female, 496 male |
| 3 | Split statistics | ~702 train, ~150 val, ~150 test |
| 4 | Generator info | Steps per epoch shown |
| 5 | Model summary | ~2.4M parameters |
| 6 | Training progress | Accuracy increasing |
| 7 | Test metrics | Aim for >85% accuracy |
| 8 | Plots & predictions | Visual confirmation |
| 9 | File locations | Google Drive path |

---

## 🔧 Troubleshooting by Cell

### Cell 1 fails:
- Restart runtime
- Check internet connection

### Cell 2 fails:
- Grant Drive permissions
- Check folder names exactly

### Cell 3 fails:
- Verify dataset exists in Drive
- Check file permissions

### Cell 4 fails:
- Check Cell 3 completed
- Verify LOCAL_DATA_PATH exists

### Cell 5 fails:
- Check Cell 4 completed
- Restart runtime if memory issue

### Cells 6/7 fail:
- Reduce BATCH_SIZE in Cell 4
- Check GPU is enabled
- Wait for previous cell to complete

### Cell 8 fails:
- Verify model was trained
- Check test images exist

### Cell 9 fails:
- Check Drive space
- Verify permissions

---

## ✅ Success Checklist

After running all cells, you should have:

- [x] Cell 1: GPU detected and libraries loaded
- [x] Cell 2: Dataset found with correct counts
- [x] Cell 3: Data split completed and visualized
- [x] Cell 4: Generators showing correct sample counts
- [x] Cell 5: Model compiled with ~2.4M parameters
- [x] Cell 6: Phase 1 completed (15-20 epochs)
- [x] Cell 7: Phase 2 completed, test accuracy >85%
- [x] Cell 8: Training plots displayed
- [x] Cell 9: `.tflite` file saved to Google Drive

---

**You're now ready to train your ampalaya classifier with full control over each step!** 🚀

For the full code, see: `train-model-test-v1.md`
