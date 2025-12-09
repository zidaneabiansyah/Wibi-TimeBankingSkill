#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting WIBI Development Environment${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}🛑 Cleaning up old processes...${NC}"
pkill -9 -f "go run" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# Start Backend
echo -e "${YELLOW}📦 Starting Backend (Port 8080)...${NC}"
cd "$(dirname "$0")/backend"
go run ./cmd/server/main.go &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Start Frontend
echo -e "${YELLOW}🎨 Starting Frontend (Port 3000)...${NC}"
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start${NC}"
    kill $BACKEND_PID
    exit 1
fi
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}🎉 WIBI Development Environment is Ready!${NC}"
echo ""
echo -e "${YELLOW}📍 Access Points:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:8080${NC}"
echo -e "   API Docs: ${GREEN}http://localhost:8080/api/v1/health${NC}"
echo ""
echo -e "${YELLOW}📝 Process IDs:${NC}"
echo -e "   Backend:  $BACKEND_PID"
echo -e "   Frontend: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}⚠️  To stop, press Ctrl+C${NC}"
echo ""

# Wait for both processes
wait
