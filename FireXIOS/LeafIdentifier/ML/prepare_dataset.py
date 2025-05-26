import os
import shutil
from pathlib import Path
import random

def prepare_dataset(dataset_path, output_path):
    """
    Prepare the PlantaeK dataset for Create ML training by organizing images into train/validation/test splits
    """
    # Create output directories
    splits = ['train', 'validation', 'test']
    for split in splits:
        os.makedirs(os.path.join(output_path, split), exist_ok=True)
    
    # Get all plant species directories
    plant_species = [d for d in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, d)) and not d.startswith('.')]
    
    # Process each plant species
    for species in plant_species:
        species_path = os.path.join(dataset_path, species)
        
        # Process both healthy and diseased leaves
        for condition in ['HEALTHY', 'DISEASED']:
            condition_path = os.path.join(species_path, condition)
            if not os.path.exists(condition_path):
                continue
                
            # Accept both lowercase and uppercase extensions
            image_files = [f for f in os.listdir(condition_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
            # Shuffle the images
            random.seed(42)  # For reproducibility
            random.shuffle(image_files)
            
            # Calculate split sizes
            total_images = len(image_files)
            train_size = int(total_images * 0.7)
            val_size = int(total_images * 0.15)
            
            # Split the images
            train_images = image_files[:train_size]
            val_images = image_files[train_size:train_size + val_size]
            test_images = image_files[train_size + val_size:]
            
            # Create label that combines species and condition
            label = f"{species}_{condition}"
            
            # Copy files to respective directories
            for split, images in [('train', train_images), ('validation', val_images), ('test', test_images)]:
                split_path = os.path.join(output_path, split, label)
                os.makedirs(split_path, exist_ok=True)
                
                for image in images:
                    src_path = os.path.join(condition_path, image)
                    dst_path = os.path.join(split_path, image)
                    shutil.copy2(src_path, dst_path)
    
    print(f"Dataset prepared successfully!")
    print(f"Plant species processed: {len(plant_species)}")
    for species in plant_species:
        species_path = os.path.join(dataset_path, species)
        for condition in ['HEALTHY', 'DISEASED']:
            condition_path = os.path.join(species_path, condition)
            if os.path.exists(condition_path):
                total_images = len([f for f in os.listdir(condition_path) if f.endswith(('.jpg', '.jpeg', '.png'))])
                print(f"{species} {condition}: {total_images} images")

if __name__ == "__main__":
    dataset_path = "leafdataset"  # Path to your downloaded dataset
    output_path = "FireXIOS/LeafIdentifier/Dataset"  # Path where processed dataset will be saved
    prepare_dataset(dataset_path, output_path) 