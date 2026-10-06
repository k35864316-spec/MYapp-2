import { isValidObjectId } from 'mongoose';
import { connectDB } from './mongodb';
import { Product as ProductModel } from '@/models/Product';

export type Product = {
  id: string;
  name: string;
  description: string;
  likes: number;
};

type ProductDocLike = {
  _id: unknown;
  name: string;
  description: string;
  likes: number;
};

function toProduct(doc: ProductDocLike): Product {
  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description,
    likes: doc.likes ?? 0,
  };
}

// 컬렉션이 비어 있을 때만 기존 샘플 데이터를 한 번 넣어줍니다.
async function seedIfEmpty() {
  const count = await ProductModel.countDocuments();
  if (count > 0) return;

  await ProductModel.insertMany([
    { name: '머그컵', description: '내가 애용하는 머그컵', likes: 3 },
    { name: '스티커팩', description: '노트북에 붙이는 스티커', likes: 5 },
    { name: 'OWASP 포스터', description: '보안 체크리스트', likes: 8 },
    { name: '노트북', description: '윈도우 노트북', likes: 10 },
    { name: '휴대폰', description: '갤럭시 폴드 8', likes: 2 },
  ]);
}

export async function getProducts(): Promise<Product[]> {
  await connectDB();
  await seedIfEmpty();
  const docs = await ProductModel.find().sort({ createdAt: 1 }).lean();
  return docs.map((doc) => toProduct(doc as ProductDocLike));
}

export async function getProduct(id: string): Promise<Product | undefined> {
  // 잘못된 형식의 id(예: /products/abc)는 DB 조회 없이 404 처리
  if (!isValidObjectId(id)) return undefined;
  await connectDB();
  const doc = await ProductModel.findById(id).lean();
  return doc ? toProduct(doc as ProductDocLike) : undefined;
}

export async function likeProduct(id: string): Promise<number> {
  if (!isValidObjectId(id)) return 0;
  await connectDB();
  // $inc로 DB에서 원자적으로 +1 (동시에 여러 명이 눌러도 값이 꼬이지 않음)
  const doc = await ProductModel.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
  ).lean();
  return doc ? (doc as ProductDocLike).likes : 0;
}
