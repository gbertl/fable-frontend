import BreadCrumb from '../../components/BreadCrumb';
import Cart from '../../components/Cart';
import CheckoutForm from '../../components/CheckoutForm';
import './style.scss';

const Checkout = () => {
  return (
    <section className="checkout">
      <div className="container">
        <BreadCrumb
          links={[
            { title: 'Shopping Bag', url: '#' },
            { title: 'Order', url: '#' },
          ]}
        />

        <div className="checkout__grid">
          <CheckoutForm />
          <Cart />
        </div>
      </div>
    </section>
  );
};

export default Checkout;