import React, { useState } from 'react';

import { Item, Product, Sizes } from '../../typings';
import { sizes, colors } from '../../data';
import { replaceItems, selectItems } from '../../store/slices/cart';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Link } from 'react-router-dom';
import { findCartItem } from '../../utils';
import { showSideCart } from '../../store/slices/ui';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const [data, setData] = useState<Item>({ productId: product.id });

  const cartItems = useAppSelector(selectItems);

  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    const item = {
      ...data,
      quantity: (data.quantity || 0) + 1,
    };

    dispatch(replaceItems([...cartItems, item]));

    setData(item);
  };

  const handleUpdateQuantity = ({ isIncrease }: { isIncrease: boolean }) => {
    const items = cartItems.map((cartItem) => {
      if (
        cartItem.productId === data.productId &&
        cartItem.colorId === data.colorId &&
        cartItem.size === data.size
      ) {
        const quantity = isIncrease
          ? (cartItem.quantity || 0) + 1
          : (cartItem.quantity || 0) - 1;

        setData((prevData) => ({ ...prevData, quantity }));

        return {
          ...cartItem,
          quantity,
        };
      } else {
        return cartItem;
      }
    });

    dispatch(replaceItems(items));
  };

  const handleChangeColor = (colorId: number) =>
    setData((prevData) => {
      const existingItem = findCartItem(cartItems, { ...prevData, colorId });

      if (existingItem) {
        return existingItem;
      } else {
        return {
          ...prevData,
          colorId,
          quantity: 0,
        };
      }
    });

  const handleChangeSize = (size: Sizes) => {
    setData((prevData) => {
      const existingItem = findCartItem(cartItems, { ...prevData, size });

      if (existingItem) {
        return existingItem;
      } else {
        return { ...prevData, size, quantity: 0 };
      }
    });
  };

  const handleKeyupQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = {
      ...data,
      quantity: parseInt(e.target.value) || 0,
    };

    const updatedCartItems = cartItems.map((ci) => {
      if (
        ci.productId === data.productId &&
        ci.colorId === data.colorId &&
        ci.size === data.size
      ) {
        return item;
      } else {
        return ci;
      }
    });

    dispatch(replaceItems(updatedCartItems));
    setData(item);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <img
        src={product?.image}
        alt=""
        className="bg-gray2 w-[650px] mb-3 md:mb-0 self-start"
      />
      <div className="md:px-8">
        <h1 className="text-sm md:text-3xl mb-1 md:mb-2 text-gray md:text-dark text-center md:text-left md:uppercase">
          {product?.name}
        </h1>
        <h2 className="mb-3 md:mb-8 text-base md:text-3xl text-center md:text-left">
          ₱{product?.price}
        </h2>

        <h3 className="md:hidden text-base md:text-xl font-normal mb-5 md:mb-0 text-center">
          Color
        </h3>
        <ul className="flex justify-center md:justify-start gap-5 md:gap-8 flex-wrap mb-5 md:mb-8">
          {colors.map((color) => (
            <li key={color.id}>
              <input
                type="radio"
                name="item-color"
                id={`item-color-${color.id}`}
                value={color.id}
                onChange={() => handleChangeColor(color.id)}
                className="hidden"
              />
              <label
                htmlFor={`item-color-${color.id}`}
                className={`block w-5 h-5 md:w-10 md:h-10 border border-black hover:border-gray border-opacity-10 cursor-pointer ${
                  data.colorId === color.id ? 'border-gray cursor-auto' : ''
                }`}
                style={{ background: color.hex }}
              ></label>
            </li>
          ))}
        </ul>
        <h3 className="md:hidden text-base md:text-xl font-normal mb-5 md:mb-0 text-center">
          Size
        </h3>
        <ul className="flex justify-center md:justify-start flex-wrap gap-5 md:gap-8 uppercase leading-none mb-5 md:mb-8">
          {sizes.map((size) => (
            <li key={size}>
              <input
                type="radio"
                name="item-size"
                id={`item-size-${size}`}
                onChange={() => handleChangeSize(size)}
                className="hidden"
              />
              <label
                htmlFor={`item-size-${size}`}
                className={`p-3 border border-black hover:border-gray border-opacity-10 cursor-pointer ${
                  data.size === size ? 'border-gray cursor-auto' : ''
                }`}
              >
                {size}
              </label>
            </li>
          ))}
        </ul>

        {data.quantity ? (
          <>
            {/* Quantity */}
            <div className="flex items-center flex-col md:flex-row mb-5">
              <h3 className="text-base md:text-xl font-normal mb-5 md:mb-0 text-center">
                Quantity <span className="hidden md:inline">:</span>
              </h3>
              <div className="flex gap-3 ml-5">
                <button
                  className="p-3"
                  onClick={() => handleUpdateQuantity({ isIncrease: false })}
                >
                  -
                </button>

                <input
                  type="number"
                  value={data.quantity}
                  onChange={handleKeyupQuantity}
                  className="w-9 outline-none text-center"
                />

                <button
                  className="p-3"
                  onClick={() => handleUpdateQuantity({ isIncrease: true })}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn btn-success w-full md:w-auto text-center"
              onClick={() => dispatch(showSideCart())}
            >
              Go to cart
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary w-full md:w-auto text-center"
            onClick={handleAddToCart}
            disabled={data.colorId && data.size ? false : true}
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
