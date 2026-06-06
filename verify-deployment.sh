#!/bin/bash
# Smart Kisan Docker Deployment Test Script

echo "=== Smart Kisan Docker Deployment Verification ==="
echo

# Check Docker installation
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo "   ✓ Docker is installed"
    docker --version
else
    echo "   ✗ Docker is NOT installed"
    exit 1
fi

echo

# Check Docker Compose
echo "2. Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    echo "   ✓ Docker Compose is installed"
    docker-compose --version
else
    echo "   ✗ Docker Compose is NOT installed"
    exit 1
fi

echo

# Check .env file
echo "3. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✓ .env file exists"
else
    echo "   ⚠ .env file not found - creating from .env.example"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   ✓ Created .env from .env.example"
        echo "   ⚠ Please update .env with your MongoDB connection string"
    fi
fi

echo

# Validate docker-compose.yml
echo "4. Validating docker-compose.yml..."
if docker-compose config > /dev/null 2>&1; then
    echo "   ✓ docker-compose.yml is valid"
else
    echo "   ✗ docker-compose.yml has errors"
    docker-compose config
    exit 1
fi

echo

# Check if ports are available
echo "5. Checking if required ports are available..."
if ! lsof -i :5173 > /dev/null 2>&1; then
    echo "   ✓ Port 5173 is available"
else
    echo "   ⚠ Port 5173 is in use"
fi

if ! lsof -i :8000 > /dev/null 2>&1; then
    echo "   ✓ Port 8000 is available"
else
    echo "   ⚠ Port 8000 is in use"
fi

echo

echo "=== Verification Complete ==="
echo
echo "To deploy, run:"
echo "  docker-compose up -d"
echo
echo "To view logs:"
echo "  docker-compose logs -f"
echo
echo "To access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
