export type Product = {
  id: string;
  name: string;
  description: string;
  likes: number;
};

const products: Product[] = [
  { id: '1', name: '머그컵', description: '내가 애용하는 머그컵', likes: 3 },
  {
    id: '2',
    name: '스티커팩',
    description: '노트북에 붙이는 스티커',
    likes: 5,
  },
  { id: '3', name: 'OWASP 포스터', description: '보안 체크리스트', likes: 8 },
  { id: '4', name: '노트북', description: '윈도우 노트북', likes: 10 },
  { id: '5', name: '휴대폰', description: '갤럭시 폴드 8', likes: 2 },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProducts(): Promise<Product[]> {
  await delay(700);
  return products;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  await delay(400);
  return products.find((p) => p.id === id);
}

export async function likeProduct(id: string): Promise<number> {
  await delay(300);
  const product = products.find((p) => p.id === id);
  if (!product) return 0;
  product.likes += 1;
  return product.likes;
}
