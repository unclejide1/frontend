import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

import apiInstance from "../../utils/axios";
import Toast from "../plugin/Toast";
import { API_BASE_URL, PAYPAL_CLIENT_ID } from "../../utils/constants";

function Checkout() {
    const [order, setOrder] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const param = useParams();
    const navigate = useNavigate();
    console.log(order.total);
    const fetchOrder = async () => {
        try {
            await apiInstance.get(`order/checkout/${param.order_oid}/`).then((res) => {
                setOrder(res.data);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        fetchOrder();
    }, []);

    const applyCoupon = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formdata = new FormData();
        formdata.append("order_oid", order.oid);
        formdata.append("coupon_code", couponCode);

        try {
            await apiInstance.post("order/coupon-apply/", formdata).then((res) => {
                if (res.data.message === "Coupon Activated") {
                    setLoading(false);
                    fetchOrder();
                    Toast().fire({
                        icon: "success",
                        title: res.data.message,
                        text: "A new coupon has been applied to your order",
                    });
                }
                if (res.data.message === "Coupon Already Activated") {
                    setLoading(false);

                    Toast().fire({
                        icon: "warning",
                        title: res.data.message,
                        text: "This coupon has been already activated!",
                    });
                }
                setCouponCode("");
            });
        } catch (error) {
            console.log(error.response.data.message);
            setLoading(false);
            Toast().fire({
                icon: "error",
                title: error.response.data.message,
            });
            setCouponCode("");
        }
    };

    const initialOptions = {
        clientId: PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const payWithStripe = (event) => {
        setPaymentLoading(true);
        event.target.form.submit();
    };
    return (
        <>
            <BaseHeader />

            <section className="py-0" style={{ marginTop: 50 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">Checkout</h1>
                                {/* Breadcrumb */}
                                <div className="d-flex justify-content-center">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb breadcrumb-dots mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="text-decoration-none text-dark">
                                                    Home
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className="text-decoration-none text-dark">
                                                    Courses
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className="text-decoration-none text-dark">
                                                    Cart
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Checkout
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-5">
                <div className="container">
                    <div className="row g-4 g-sm-5">
                        <div className="col-xl-8 mb-4 mb-sm-0">
                            <div className="alert alert-warning alert-dismissible d-flex justify-content-between align-items-center fade show py-2 pe-2" role="alert">
                                <div>
                                    <i className="bi bi-exclamation-octagon-fill me-2" />
                                    Review your courses before payment
                                </div>

                                <button type="button" className="btn btn-warning mb-0 text-primary-hover text-end" data-bs-dismiss="alert" aria-label="Close">
                                    <i className="bi bi-x-lg text-white" />
                                </button>
                            </div>

                            <div className="p-4 shadow rounded-3 mt-4">
                                <h5 className="mb-0 mb-3">Courses</h5>

                                <div className="table-responsive border-0 rounded-3">
                                    <table className="table align-middle p-4 mb-0">
                                        <tbody className="border-top-2">
                                            {order?.order_items?.map((o, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-lg-flex align-items-center">
                                                            <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                <img src={o.course?.image} style={{ width: "100px", height: "70px", objectFit: "cover" }} className="rounded" alt="" />
                                                            </div>
                                                            <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                <a href="#" className="text-decoration-none text-dark">
                                                                    {o.course?.title}
                                                                </a>
                                                            </h6>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <h5 className="text-success mb-0">$350</h5>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Link to={`/cart/`} className="btn btn-outline-secondary mt-3">
                                    Edit Cart <i className="fas fa-edit"></i>
                                </Link>
                            </div>

                            <div className="shadow p-4 rounded-3 mt-5">
                                <h5 className="mb-0">Personal Details</h5>
                                <div className="row g-3 mt-0">
                                    <div className="col-md-12 bg-light-input">
                                        <label htmlFor="yourName" className="form-label">
                                            Your name *
                                        </label>
                                        <input type="text" className="form-control bg-light" id="yourName" placeholder="Name" value={order.full_name} readOnly />
                                    </div>
                                    <div className="col-md-12 bg-light-input">
                                        <label htmlFor="emailInput" className="form-label">
                                            Email address *
                                        </label>
                                        <input type="email" className="form-control bg-light" id="emailInput" placeholder="Email" value={order.email} readOnly />
                                    </div>

                                    {/* Country option */}
                                    <div className="col-md-12 bg-light-input">
                                        <label htmlFor="mobileNumber" className="form-label">
                                            Select country *
                                        </label>
                                        <input type="text" className="form-control bg-light" id="mobileNumber" placeholder="Country" value={order.country} readOnly />
                                    </div>
                                </div>
                                {/* Form END */}
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="row mb-0">
                                <div className="col-md-6 col-xl-12">
                                    <div className="shadow p-4 mb-4 rounded-3">
                                        <h4 className="mb-4">Order Summary</h4>
                                        <div className="mb-1">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>Transaction ID</span>
                                                <p className="mb-0 h6 fw-bold">{param.order_oid}</p>
                                            </div>
                                        </div>

                                        <form onSubmit={applyCoupon} className="input-group mt-3">
                                            <input onChange={(e) => setCouponCode(e.target.value)} required className="form-control form-control" placeholder="COUPON CODE" />
                                            {loading === true ? (
                                                <button disabled className="btn btn-primary">
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                </button>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    Apply
                                                </button>
                                            )}
                                        </form>

                                        <div className="p-3 shadow rounded-3 mt-3">
                                            <h4 className="mb-3">Cart Total</h4>
                                            <ul class="list-group mb-3">
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    Sub Total
                                                    <span>${order.sub_total}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    Discount
                                                    <span>${order.saved}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    Tax
                                                    <span>${order.tax_fee}</span>
                                                </li>
                                                <li class="list-group-item d-flex fw-bold justify-content-between align-items-center">
                                                    Total
                                                    <span className="fw-bold">${order?.total}</span>
                                                </li>
                                            </ul>
                                            <div className="d-grid">
                                                {/* <Link to={`/success/txn_id/`} className="btn btn-lg btn-success mt-2"> Pay With PayPal</Link>
                                                <Link to={`/success/txn_id/`} className="btn btn-lg btn-success mt-2"> Pay With Stripe</Link> */}

                                                {paymentLoading === true && (
                                                    <form action={`${API_BASE_URL}stripe-checkout/${param?.order_oid}/`} method="POST">
                                                        <button onClick={payWithStripe} type="submit" className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }}>
                                                            Processing... <i className="fas fa-spinner fa-spin"></i>{" "}
                                                        </button>
                                                    </form>
                                                )}

                                                {paymentLoading === false && (
                                                    <form action={`${API_BASE_URL}payment/stripe-checkout/${param?.order_oid}/`} method="POST">
                                                        <button onClick={payWithStripe} type="submit" className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }}>
                                                            Pay Now (Stripe)
                                                        </button>
                                                    </form>
                                                )}

                                                <PayPalScriptProvider options={initialOptions}>
                                                    <PayPalButtons
                                                        className="mt-3"
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            currency_code: "USD",
                                                                            value: order?.total.toString(),
                                                                        },
                                                                    },
                                                                ],
                                                            });
                                                        }}
                                                        onApprove={(data, actions) => {
                                                            return actions.order.capture().then((details) => {
                                                                const name = details.payer.name.given_name;
                                                                const status = details.status;
                                                                const paypal_order_id = data.orderID;

                                                                console.log(status);
                                                                if (status === "COMPLETED") {
                                                                    navigate(`/payment-success/${param.order_oid}/?paypal_order_id=${paypal_order_id}`);
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </PayPalScriptProvider>
                                            </div>
                                            <p className="small mb-0 mt-2 text-center">
                                                By proceeding to payment, you agree to these{" "}
                                                <a href="#">
                                                    {" "}
                                                    <strong>Terms of Service</strong>
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Checkout;
