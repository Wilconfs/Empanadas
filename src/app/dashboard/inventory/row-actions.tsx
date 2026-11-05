// src/app/dashboard/inventory/row-actions.tsx
"use client"

import { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // Nota: En Next.js las Server Actions puras van mejor en archivos "use server", hagámoslo limpio: