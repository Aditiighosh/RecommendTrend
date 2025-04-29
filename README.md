# 👗 Fashion Recommendation System

![Fashion Recommendation Demo](demo.gif) <!-- Add your demo GIF/screenshot here -->

A Pinterest-inspired AI system that recommends similar outfits and purchasable accessories based on uploaded images.

## ✨ Project Description

This project helps users discover fashion inspiration by:
1. Analyzing uploaded outfit images
2. Finding visually similar Pinterest fashion pins
3. Extracting jewelry & accessories from those pins
4. Recommending purchasable items from e-commerce sites (Myntra, Ajio, etc.)

Built with Next.js and Google Cloud Vertex AI Matching Engine, it provides personalized fashion recommendations with direct shopping links.

## 🚀 Features

### Core Functionality
✔ **Image Upload** - Users upload outfit photos  
✔ **Theme Selection** - Choose aesthetic categories (Bohemian, Y2K, Minimalist)  
✔ **AI-Powered Matching** - Finds similar Pinterest pins using vector similarity  
✔ **Accessory Detection** - Identifies jewelry and fashion items  
✔ **E-commerce Integration** - Recommends buyable products  

### Technical Highlights
⚡ Real-time image processing  
⚡ Personalized recommendations  
⚡ Seamless API integrations  

## 🛠 Tech Stack

| Category          | Technologies Used                          |
|-------------------|--------------------------------------------|
| **Frontend**      | Next.js, React, NextUI                     |
| **Backend**       | Node.js, Next.js API Routes                |
| **AI/ML**         | Google Vertex AI, TensorFlow.js            |
| **Storage**       | Local file storage (for uploads)           |
| **APIs**          | Pinterest API, E-commerce Affiliate APIs   |

## 🔍 How It Works

```mermaid
graph TD
    A[User Uploads Image] --> B[Image Processing]
    B --> C[Vector Generation]
    C --> D[Similarity Search]
    D --> E[Pinterest Matches]
    E --> F[Accessory Detection]
    F --> G[E-commerce Recommendations]
