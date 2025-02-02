# Alert-Net Codebase Readme

## Overview

AlertNet is a community-driven crime reporting platform that integrates AI to enhance public safety in the MENA region. Users can report crimes in real time, and the platform utilizes natural language processing (NLP) to classify incidents based on key details from descriptions. Geospatial analysis with clustering algorithms helps visualize crime hotspots, while retrospective evaluation cross-validates reports with external sources for accuracy. A user reputation system ensures credibility, flagging false reports and rewarding reliable contributors. This combination of community validation and AI-powered insights fills crime data gaps and improves situational awareness.

## Key Features

*   **Data Generation**: We generate synthetic data for users, alerts (Cairo & Abu Dhabi), and interactions.
*   **Location Clustering**: Ensures location clustering for DBSCAN detection.
*   **Valid Foreign Key Relationships**: Maintains valid foreign key relationships between tables.
*   **Crime Classification**: Uses a BERT-based LLM classifier for crime classification.
*   **Alert Credibility**: Uses a Random Forest ML solution for calculating a credibility score for alerts based on the alert data and credibility score of the user.
*   **User Credibility**: Uses a formula based on responses on the user's alerts. If the credibility is below 0.2, we flag the alert and queue it for review by a human moderator. If it is approved, it is displayed on the application.

## Notebooks & Script

This is contained in the "AI Elements" directory:
*   `data_generation.ipynb`: Generates synthetic data for users, alerts, and interactions.
*   `crime_classification.ipynb`: Classifies crimes using a text classification pipeline.
*   `AI.ipynb`: Clustering Alerts using DBSCAN.
*   `firebase_script/`: Directory of scripts used for firestore automation.
*   Other scripts in the "AI Elements" directory are used for automating tasks such as data ingestion, model testing, and more.

## Getting Started

1.  Clone the repository: `git clone https://github.com/alert-net/alert-net.git`
2.  Install dependencies: `npm install` or `pip install -r requirements.txt`
3.  Run notebooks: `jupyter notebook` (for Jupyter notebooks) or `python script_name.py` (for Python scripts)
4.  Interact with Firebase Firestore using `firebase_interaction.py`

## Submission Deck
https://drive.google.com/drive/folders/1cbv6_nlKi_KNiw3ANEhIf_WN_TfjkUzc?usp=share_link