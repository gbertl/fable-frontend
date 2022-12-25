import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

import HeroPopover from './HeroPopover';
import { HeroProduct } from '../../typings';
import axios from '../../axios';
import { useQuery } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { HiPlusCircle } from 'react-icons/hi2';
import { useAuth0 } from '@auth0/auth0-react';
import { useCheckAdminRole } from '../../hooks';
import HeroProductModalForm from './HeroProductModalForm';

const HeroSlider = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(min-width: 576px)' });

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState('');

  const { data: heroProducts } = useQuery<HeroProduct[]>(
    'heroProducts',
    async () => {
      const { data } = await axios.get('/hero-products');
      return data;
    }
  );

  const { isAuthenticated } = useAuth0();
  const isAdmin = useCheckAdminRole();

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      {isAuthenticated && isAdmin && (
        <button className="text-xl" onClick={() => setIsFormOpen(true)}>
          <HiPlusCircle />
        </button>
      )}

      <Swiper
        className="hero__slider"
        slidesPerView={isDesktop ? 9 : isTablet ? 6 : isMobile ? 3 : 2}
        spaceBetween={3}
      >
        {heroProducts?.map((p, idx) => (
          <SwiperSlide
            key={idx}
            onMouseEnter={() => {
              if (p._id) {
                setIsHovered(true);
                setHoveredId(p._id);
              }
            }}
            onMouseLeave={() => {
              if (p._id) {
                setIsHovered(false);
                setHoveredId('');
              }
            }}
          >
            <img src={p.imageUrl} alt="" />
            <AnimatePresence>
              {p.product && isHovered && hoveredId === p._id && (
                <HeroPopover productId={p.product as number} />
              )}
            </AnimatePresence>
          </SwiperSlide>
        ))}
      </Swiper>

      <AnimatePresence>
        {isFormOpen && <HeroProductModalForm setIsFormOpen={setIsFormOpen} />}
      </AnimatePresence>
    </>
  );
};

export default HeroSlider;
