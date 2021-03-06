import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faStar, faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../contexts/CartContext";

export default function ProductPage(){
    let params = useParams();
    let navigate = useNavigate();

    const { cart, setCart } = useContext(CartContext);

    const [product, setProduct] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(1)

    useEffect(() => {
        setIsLoading(true);
        async function handleFetch(){
            const url = `https://fakestoreapi.com/products/${params.id}`;
            const response = await fetch(url);
            const data = await response.json();
            setProduct(data);
            setIsLoading(false);
        }
        handleFetch();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(product){
            let inCart = false;
            cart.map((item) => {
                if(item.id == product.id){
                    inCart = true;
                    item.count += count;
                }
            })
            if(!inCart){
                cart.push({
                    id: product.id,
                    count,
                    image: product.image,
                    title: product.title,
                    price: product.price
                });
            }
            navigate("/cart");
        }
    };

    if(isLoading){
        return (
            <div className="loading-spinner-wrapper">
                <FontAwesomeIcon icon={faSpinner} size="3x" className="fa-pulse"/>
            </div>
        );
    } else if(product){
        const roundedRating = Math.round(product.rating.rate);
        const roundedUp = (roundedRating>product.rating.rate);
        let stars = [];
        for (let i = 0; i < roundedRating-1; i++) {
            stars.push(<FontAwesomeIcon icon={faStar} size="lg" className="rating-star" />);
        }
        if(roundedUp) stars.push(<FontAwesomeIcon icon={faStarHalfStroke} size="lg" className="rating-star" />);

        return (
            <div className="product-page-wrapper">
                <div className="product-page-image-wrapper">
                    <img className="product-page-image" src={product.image}/>
                </div>
                <div className="product-page-right">
                    <div className="product-page-title">{product.title}</div>
                    <div className="product-page-details">
                        {stars}
                        <div className="product-page-filler"></div>
                        <div className="product-page-category">{product.category}</div>
                    </div>
                    <hr/>
                    <div className="product-page-descripiopn">{product.description}</div>
                    <hr/>
                    <form className="product-page-form" onSubmit={handleSubmit}>
                        <div className="product-page-filler"></div>
                        <div className="product-page-price">${product.price}</div>
                        <input type="number" className="product-page-count" value={count} min="1" onChange={(e) => setCount(parseInt(e.target.value))}/>
                        <button className="product-page-submit">ADD TO CART</button>
                    </form>
                </div>
            </div>
        );
    }
}