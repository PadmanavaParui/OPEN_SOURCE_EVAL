# Global Economic Trends Dashboard
---

# 📈 Global Economic Trends Dashboard

A data visualization dashboard built to track and compare macroeconomic indicators (GDP, inflation, and unemployment) across various countries. 1

## 📖 About The Project

This project was built to solve the challenge of visualizing complex and often siloed macroeconomic data. It provides a clean, interactive interface for users to select countries and specific indicators, rendering comparative charts to show economic trends over time.

The primary data source is the **World Bank Open Data API**2, providing reliable, standardized data from across the globe.

## ✨ Features

- **Dynamic Data Visualization:** Compare trends for key indicators:
    
    - GDP (Gross Domestic Product)
        
    - Inflation (Consumer Price Index)
        
    - Unemployment (% of Total Labor Force)
        
- **Global Comparison:** Select multiple countries to overlay their economic data on a single, interactive chart.
    
- **Interactive Charts:** Powered by Plotly.js for a responsive, detailed, and professional-grade charting experience.
    
- **[Bonus] Predictive Insights:** Utilizes a simple regression model to forecast future GDP trends based on historical data. 3
    

## 🛠️ Tech Stack

This project is built with a modern web stack:

- **Frontend:** **React**
    
- **Backend:** **Python (Flask, Pandas)** 4
    
- **Visualization:** **Plotly.js** 5
    
- **Data API:** **World Bank Open Data API** 6
    

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js & npm:** [Download Here](https://nodejs.org/en/download/)
    
- **Python 3:** [Download Here](https://www.python.org/downloads/)
    
- **Git:** [Download Here](https://www.google.com/search?q=https://git-scm.com/downloads)
    

### Installation

1. **Clone the repo**
    
    Bash
    
    ```
    git clone https://github.com/your-username/global-economic-dashboard.git
    cd global-economic-dashboard
    ```
    
2. **Set up the Backend (Flask)**
    
    Bash
    
    ```
    # Navigate to the backend folder (assuming 'backend')
    cd backend
    
    # Create a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    
    # Install Python dependencies
    pip install -r requirements.txt
    ```
    
3. **Set up the Frontend (React)**
    
    Bash
    
    ```
    # Navigate to the frontend folder (assuming 'frontend')
    cd ../frontend
    
    # Install NPM packages
    npm install
    ```
    
4. **Run the application**
    
    - **Terminal 1 (Backend):**
        
        Bash
        
        ```
        cd ../backend
        source venv/bin/activate
        flask run
        ```
        
    - **Terminal 2 (Frontend):**
        
        Bash
        
        ```
        cd ../frontend
        npm start
        ```
        
    
    Open `http://localhost:3000` in your browser to see the app.
    

---

## 📊 Data Source

This project relies entirely on the **World Bank Open Data API**. 7 The key indicators used are:

- **GDP:** `NY.GDP.MKTP.CD` (GDP in current US$)
    
- **Inflation:** `FP.CPI.TOTL.ZG` (Inflation, consumer prices, annual %)
    
- **Unemployment:** `SL.UEM.TOTL.ZS` (Unemployment, total, % of total labor force)
    
