import React from 'react';
import { useParams } from 'react-router-dom';
import { ShopPage } from './shop/ShopPage';
import { ProductPage } from './shop/ProductPage';

export default function Shop() {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    return <ProductPage />;
  }

  return <ShopPage />;
}
