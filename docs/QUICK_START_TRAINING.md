# Quick Start Guide - Training Your Ampalaya Classifier

## Pre-Training Checklist

### 1. Prepare Your Dataset ✓
- [x] You have 507 female images in `ampalayabilog female` folder
- [x] You have 496 male images in `ampalayabilog male` folder  
- [ ] Upload both folders to: `Google Drive/MyDrive/EGourd/Senior_Datasets/`
- [ ] Verify folder structure matches exactly (including spaces in names)

### 2. Open Google Colab
1. Go to: https://colab.research.google.com
2. Click: **File → New Notebook**
3. Name it: `Ampalaya_Training`

### 3. Configure Runtime
1. Click: **Runtime → Change runtime type**
2. Select: **T4 GPU** (NOT CPU or TPU)
3. Click: **Save**

### 4. Copy Training Code
1. Open: `train-model-test-v1.md` (in your docs folder)
2. **Important**: The code is organized into **9 separate cells**
3. Copy each cell one by one into separate cells in Colab
4. **OR** Copy all code and use `Ctrl+M B` to split into cells

### 5. Run Training
1. **Run cells in order**: Cell 1 → Cell 2 → ... → Cell 9
2. **Don't skip cells** - they depend on each other
3. Allow: Google Drive access when prompted (Cell 2)
4. Wait: Follow the expected timing for each cell
5. Monitor: Watch the progress bars and accuracy metrics

**Tip**: Use `Shift+Enter` to run a cell and automatically move to the next one.

## What to Expect During Training

### Cell-by-Cell Execution

**Cell 1: Setup (30s)**
```
✓ Installing packages...
✓ TensorFlow loaded
✓ GPU detected
✓ All libraries imported successfully!
```

**Cell 2: Mount Drive (10s)**
```
✓ Google Drive mounted
✓ Female dataset found: 507 images
✓ Male dataset found: 496 images
```

**Cell 3: Organize Dataset (2-5 min)**
```
✓ Creating directory structure...
✓ Female: 355 train, 76 val, 76 test (Total: 507)
✓ Male: 347 train, 74 val, 75 test (Total: 496)
✓ Sample visualization displayed
```

**Cell 4: Configure Data (10s)**
```
✓ Hyperparameters configured!
✓ Data generators ready!
Training samples: 702
```

**Cell 5: Build Model (5s)**
```
✓ Model compiled successfully
✓ Training callbacks configured
Total params: 2,421,569
```

**Cell 6: Train Phase 1 (15-30 min)**
```
Epoch 1/20: 100%|████████| 44/44 [00:45<00:00]
loss: 0.6234 - accuracy: 0.6523 - val_loss: 0.5123 - val_accuracy: 0.7456
...
✓ Phase 1 training complete!
```

**Cell 7: Train Phase 2 & Evaluate (20-60 min)**
```
Epoch 20/100: 100%|████████| 44/44 [00:52<00:00]
...
Test Accuracy: 89.40%
✓ Training and evaluation complete!
```

**Cell 8: Visualize (30s)**
```
✓ Training history plot displayed
✓ Sample predictions:
  ✓ True: female | Predicted: female (92.3%)
  ✓ True: male   | Predicted: male   (88.7%)
```

**Cell 9: Export & Save (1-2 min)**
```
✓ TensorFlow Lite model saved: 3.42 MB
✓ All files saved to Google Drive
🎉 ALL DONE! Your model is ready for deployment!
```

## Download Your Trained Model

After training completes, download these files:

### Location in Google Drive:
```
MyDrive/
└── EGourd/
    └── Model_Versions/
        └── Version_10-30-2025_1/  ← Date-based version folder
            ├── ampalaya_classifier.tflite  ← ⭐ Use in Expo app!
            ├── model_metadata.json          ← ⭐ Use in Expo app!
            ├── ampalaya_classifier.h5       ← Backup (for retraining)
            ├── training_history.png         ← Documentation
            ├── sample_images.png            ← Documentation
            └── best_model.h5                ← Backup checkpoint
```

**Note:** Version numbers increment automatically:
- First: `Version_10-30-2025_1`
- Second: `Version_10-30-2025_2`
- Third: `Version_10-30-2025_3`

### Files You Need for Expo:
1. **`ampalaya_classifier.tflite`** ⭐ - The mobile model (3-4 MB)
2. **`model_metadata.json`** ⭐ - Configuration file (<1 KB)

**Note**: The other files (.h5, .png) are for backup and documentation purposes.

## Quick Troubleshooting

### Problem: "No GPU found"
**Fix:** Runtime → Change runtime type → T4 GPU → Save → Restart runtime

### Problem: "Dataset not found" 
**Fix:** Check exact folder names:
- ✅ `ampalayabilog female` (with space)
- ❌ `ampalayabilog_female` (no underscore)
- ❌ `Ampalayabilog Female` (no capitals)

### Problem: "Out of memory"
**Fix:** Already optimized! But if needed, change line:
```python
BATCH_SIZE = 16  # Change to 8 if still issues
```

### Problem: "Training stuck at 50% accuracy"
**Fix:** 
- Check images are in correct folders
- Verify male and female flowers are visually different
- Ensure images aren't corrupted

### Problem: "Permission denied on Google Drive"
**Fix:** Click the link when prompted and grant access to Colab

## Training Time Reference

| Cell | Task | Expected Time | Can Skip? |
|------|------|---------------|-----------|
| 1 | Setup & Install | 30 seconds | ❌ Never |
| 2 | Mount & Verify | 10 seconds | ❌ Never |
| 3 | Organize Data | 2-5 minutes | ⚠️ Once only |
| 4 | Configure | 10 seconds | ❌ If changing settings |
| 5 | Build Model | 5 seconds | ❌ Never |
| 6 | Train Phase 1 | 15-30 minutes | ❌ Never |
| 7 | Train Phase 2 | 20-60 minutes | ❌ Never |
| 8 | Visualize | 30 seconds | ✅ Optional |
| 9 | Export | 1-2 minutes | ❌ To get model |
| **Total** | - | **35-90 minutes** | - |

## Success Indicators

You're on track if you see:

✅ **Training accuracy increasing** (starts around 50%, should reach 85-95%)  
✅ **Validation accuracy following training** (within 5-10% difference)  
✅ **Loss decreasing** (both training and validation)  
✅ **No "Out of Memory" errors**  
✅ **GPU utilization showing in logs**  

## What Happens Next?

### After Training Completes:

1. **Check Final Metrics**
   ```
   Test Accuracy:  89.40%  ← Target: >85%
   Precision:      88.52%  ← Target: >85%
   Recall:         90.12%  ← Target: >85%
   F1 Score:       89.31%  ← Target: >85%
   ```

2. **Review Training Plots**
   - Look at `training_history.png`
   - Verify no overfitting (curves should be close)

3. **Download Files**
   - Navigate to the timestamped folder in Google Drive
   - Download `.tflite` and `.json` files

4. **Integrate into Expo App**
   - Place `.tflite` in `frontend/mobile-app/assets/`
   - Update your prediction code to use the model

## Pro Tips

💡 **Tip 1**: Keep the Colab tab active to prevent disconnection  
💡 **Tip 2**: Use `Shift+Enter` to run cells quickly  
💡 **Tip 3**: Training can continue if tab refreshes - model checkpoints are saved  
💡 **Tip 4**: Download files immediately after Cell 9 completes  
💡 **Tip 5**: You can rerun Cell 8 anytime to check results  
💡 **Tip 6**: Don't rerun Cell 3 unless you want to re-split data  
💡 **Tip 7**: To change batch size, modify Cell 4 and rerun from there  
💡 **Tip 8**: Save the training history plot to track improvements  

## Common Questions

**Q: Can I close my laptop while training?**  
A: Yes! Training runs on Google's servers. Just don't close the browser tab.

**Q: What if my internet disconnects?**  
A: Training continues! Reconnect and check progress. Best checkpoints are saved.

**Q: Can I modify the code between cells?**  
A: Absolutely! That's the benefit of the cell structure. Just rerun from your modified cell.

**Q: Which cell takes the longest?**  
A: Cell 7 (Phase 2 training) typically takes 20-60 minutes.

**Q: Can I skip Cell 8 (visualization)?**  
A: Yes, but it's helpful to verify your model's performance visually.

**Q: How do I change hyperparameters?**  
A: Edit Cell 4, then rerun Cells 4-7 (no need to reorganize data).

**Q: What if Cell 3 fails?**  
A: Check your folder names match exactly: `ampalayabilog female` and `ampalayabilog male`

**Q: Can I use CPU instead of GPU?**  
A: Not recommended. It would take 10-20x longer (6-15 hours vs 35-90 minutes).

**Q: How many times can I train?**  
A: As many as you want! Just rerun Cells 5-7 with different settings.

## Need Help?

If training fails or results are poor:

1. **Check the logs** - Error messages are usually descriptive
2. **Verify dataset** - Make sure images are properly labeled
3. **Review sample images** - Look at the visualization output
4. **Check GPU** - Ensure T4 GPU is actually enabled
5. **Try again** - Sometimes a fresh runtime helps

## Ready? Let's Train! 🚀

1. ✅ Dataset uploaded to Google Drive
2. ✅ Google Colab notebook created  
3. ✅ T4 GPU enabled
4. ✅ Code copied and pasted
5. ✅ Run all cells!

**Good luck with your training!** Your ampalaya classifier will be ready soon! 🌱

---

**Next Document**: After training, see `train-model-test-v1.md` for Expo integration details.
