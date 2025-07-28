// src/app/api/produk-hukum-kategori/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, query, orderBy, writeBatch, where } from 'firebase/firestore';

const CATEGORY_COLLECTION = "produk-hukum-kategori";
const PRODUK_COLLECTION = "produk-hukum";

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

const defaultCategories = ["Perdes", "Keputusan Desa"];

export async function GET() {
  try {
    const q = query(collection(db, CATEGORY_COLLECTION), orderBy("name", "asc"));
    const data = await getDocs(q);

    // Jika tidak ada kategori sama sekali, buat default
    if (data.empty) {
        const batch = writeBatch(db);
        const categoriesToReturn = [];
        for (const catName of defaultCategories) {
            const docRef = doc(collection(db, CATEGORY_COLLECTION));
            batch.set(docRef, { name: catName });
            categoriesToReturn.push({ id: docRef.id, name: catName });
        }
        await batch.commit();
        // Mengurutkan sebelum mengirim
        categoriesToReturn.sort((a, b) => a.name.localeCompare(b.name));
        return NextResponse.json(categoriesToReturn);
    }

    const categories = data.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }
        const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), { name });
        return NextResponse.json({ id: docRef.id, name }, { status: 201 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, newName, oldName } = await request.json();
        if (!id || !newName || !oldName) {
            return NextResponse.json({ error: 'ID, new name, and old name are required' }, { status: 400 });
        }
        
        const batch = writeBatch(db);

        // 1. Update the category name itself
        const categoryDocRef = doc(db, CATEGORY_COLLECTION, id);
        batch.update(categoryDocRef, { name: newName });

        // 2. Find all products with the old category and update them
        const productsQuery = query(collection(db, PRODUK_COLLECTION), where("category", "==", oldName));
        const productsSnapshot = await getDocs(productsQuery);
        productsSnapshot.forEach(productDoc => {
            batch.update(productDoc.ref, { category: newName });
        });

        // Commit all changes
        await batch.commit();

        return NextResponse.json({ message: 'Category and related products updated successfully' });
    } catch (error) {
        console.error("Firebase PUT Error:", error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await deleteDoc(doc(db, CATEGORY_COLLECTION, id));
        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
