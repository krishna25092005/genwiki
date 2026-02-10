#!/bin/bash

# Quick Deployment Script for Linux/Mac
# WikiGen Platform Deployment Helper

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "   WikiGen Deployment Helper"
echo "========================================"
echo ""

show_menu() {
    echo "Please select deployment option:"
    echo ""
    echo "1. Deploy to Vercel (Frontend)"
    echo "2. Deploy to Railway (Backend)"
    echo "3. Deploy with Docker (Full Stack)"
    echo "4. Run deployment checks"
    echo "5. Exit"
    echo ""
}

deploy_vercel() {
    echo ""
    echo "========================================"
    echo "   Deploying to Vercel"
    echo "========================================"
    echo ""
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo ""
    echo "Running build..."
    pnpm build
    
    echo ""
    echo "Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✅ Frontend deployed to Vercel!${NC}"
    echo "Check your Vercel dashboard for the URL."
}

deploy_railway() {
    echo ""
    echo "========================================"
    echo "   Deploying to Railway"
    echo "========================================"
    echo ""
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo ""
    echo "Logging in to Railway..."
    railway login
    
    echo ""
    echo "Deploying backend..."
    cd backend
    railway up
    cd ..
    
    echo ""
    echo -e "${GREEN}✅ Backend deployed to Railway!${NC}"
    echo "Check your Railway dashboard for the URL."
}

deploy_docker() {
    echo ""
    echo "========================================"
    echo "   Docker Deployment"
    echo "========================================"
    echo ""
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed!${NC}"
        echo "Please install Docker from: https://docs.docker.com/get-docker/"
        return 1
    fi
    
    echo ""
    echo "Building and starting containers..."
    docker-compose up --build -d
    
    echo ""
    echo -e "${GREEN}✅ Docker containers started!${NC}"
    echo ""
    echo "Services available at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8000"
    echo "  MongoDB:  localhost:27017"
    echo ""
    echo "View logs with: docker-compose logs -f"
    echo "Stop with: docker-compose down"
}

run_checks() {
    echo ""
    echo "========================================"
    echo "   Running Deployment Checks"
    echo "========================================"
    echo ""
    node scripts/check-deployment.js
}

while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_vercel
            echo ""
            read -p "Press Enter to continue..."
            ;;
        2)
            deploy_railway
            echo ""
            read -p "Press Enter to continue..."
            ;;
        3)
            deploy_docker
            echo ""
            read -p "Press Enter to continue..."
            ;;
        4)
            run_checks
            echo ""
            read -p "Press Enter to continue..."
            ;;
        5)
            echo ""
            echo "Thanks for using WikiGen Deployment Helper!"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
done
