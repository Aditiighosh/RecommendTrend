from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import sys
import io
import base64
import torchvision
from torchvision.transforms import functional as F
import os

# Load the CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", use_fast=False)  # Explicitly set use_fast=False

def generate_image_embedding(image_input):
    """
    Generate image embedding from an image file path or image buffer.
    
    Args:
        image_input (str or bytes): File path to the image or image buffer (bytes).
    
    Returns:
        list: Normalized image embedding as a list of floats.
    """
    try:
        # Load the image from file path or buffer
        if isinstance(image_input, str):  # File path
            image = Image.open(image_input)
        elif isinstance(image_input, bytes):  # Image buffer
            image = Image.open(io.BytesIO(image_input))
        else:
            raise ValueError("Invalid image input. Must be a file path or image buffer.")

          
        inputs = processor(images=image, return_tensors="pt", padding=True)

        # Generate the image embedding
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)

        # Normalize the embedding
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)

        # Convert the tensor to a list and return
        return image_features.squeeze().tolist()

    except Exception as e:
        print(f"Error generating image embedding: {e}", file=sys.stderr)
        sys.exit(1)

def segment_clothing(image, save_dir="segmented_clothing"):
    """
    Segment the image using a pretrained Mask R-CNN model and extract clothing items.
    Save the segmented clothing items as cropped images.
    
    Args:
        image (PIL.Image.Image): Input image.
        save_dir (str): Directory to save the segmented clothing items.
    
    Returns:
        list: Detected clothing items with bounding boxes, labels, and scores.
    """
    # Load a pretrained Mask R-CNN model
    model = torchvision.models.detection.maskrcnn_resnet50_fpn(weights="DEFAULT")
    model.eval()

    # Convert PIL image to tensor
    image_tensor = F.to_tensor(image).unsqueeze(0)

    # Perform inference
    with torch.no_grad():
        predictions = model(image_tensor)

    # Define clothing-related labels (example: COCO dataset labels)
    clothing_labels = [1, 2, 3, 4, 5, 6, 7]  # Replace with actual clothing label IDs

    clothing_items = []
    os.makedirs(save_dir, exist_ok=True)  # Create the directory if it doesn't exist

    for pred in predictions:
        boxes = pred['boxes'].cpu().numpy()
        labels = pred['labels'].cpu().numpy()
        scores = pred['scores'].cpu().numpy()

        # Filter for clothing items with high confidence
        for i, (box, label, score) in enumerate(zip(boxes, labels, scores)):
            if score > 0.5 and label in clothing_labels:  # Confidence threshold and clothing filter
                clothing_items.append({
                    'box': box.tolist(),
                    'label': label,
                    'score': score
                })

                # Crop the image using the bounding box
                cropped_image = image.crop((box[0], box[1], box[2], box[3]))

                # Save the cropped image
                save_path = os.path.join(save_dir, f"clothing_item_{i}.png")
                cropped_image.save(save_path)

    return clothing_items

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python clip.py <image_path_or_base64_buffer>", file=sys.stderr)
        sys.exit(1)

    input_arg = sys.argv[1]

    try:
        if input_arg.startswith("data:image"):
            base64_data = input_arg.split(",")[1]
            image_buffer = base64.b64decode(base64_data)
            embedding = generate_image_embedding(image_buffer)
        else:
            embedding = generate_image_embedding(input_arg)

        print(embedding)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)