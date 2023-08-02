#!/bin/bash

npx prisma db push
exec node dist/main.js
