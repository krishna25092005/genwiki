#!/bin/bash

# Backend Installation Script for Gen Z Wikipedia

echo "🚀 Setting up Gen Z Wikipedia Backend..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip."
    exit 1
fi

echo "✅ pip3 found"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "="*50
echo "✅ Backend setup complete!"
echo "="*50
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your environment variables"
echo "   $ cp .env.example .env"
echo ""
echo "2. Start MongoDB (make sure it's running on localhost:27017 or update MONGODB_URI in .env)"
echo ""
echo "3. Seed the database with sample data:"
echo "   $ python scripts/seed_database.py"
echo ""
echo "4. Start the development server:"
echo "   $ uvicorn main:app --reload"
echo ""
echo "API Documentation will be available at:"
echo "  - http://localhost:8000/docs (Swagger UI)"
echo "  - http://localhost:8000/redoc (ReDoc)"
echo ""
echo "="*50
