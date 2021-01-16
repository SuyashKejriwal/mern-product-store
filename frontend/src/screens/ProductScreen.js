import React, { useState,useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Image, Button,Form } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/Rating'
import Meta from '../components/Meta'
import { listProductsDetails,
         createProductReview
        } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ history,match }) => {
    const productId=match.params.id;
    const [qty, setQty] = useState(1); // set quantity as component level state
    const [rating,setRating]=useState(0);
    const [comment,setComment]=useState('');
    
    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product }= productDetails

    const productCreateReview = useSelector(state => state.productCreateReview)
    const { loading:loadingReview,
            success:successReview,
            error: errorReview 
        }= productCreateReview

    useEffect(() => {
        if (successReview) {
            alert('Review Submitted!!')
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
            dispatch(listProductsDetails(productId))
          }
        if(product===undefined || product._id!==productId){
            dispatch(listProductsDetails(productId))
            
        }
    }, [dispatch, match,product,productId,successReview])
    
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler= (e) => {
        e.preventDefault();
        dispatch(createProductReview(productId,{
            rating,
            comment
        }))
    }

    return (
        <>
            <Link className="btn btn-light my-3" to="/">
                Go back
            </Link>
            {loading ? 
                (<Loader />) :
                error ? 
                    (<Message variant='danger' children={error}></Message>) :(
                    <>
                    <Meta title={product.name}/>
                    <Row>
                <Col md={6}>
                    <Image src={product.image} style={{ width: 400, height: 400, }}
                        alt={product.name} fluid rounded thumbnail />
                </Col>
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>{product.name}</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating value={product.ratings}
                                text={`${product.numReviews} reviews`} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: Rs. {product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Price
                                    </Col>
                                    <Col>
                                        <strong>Rs. {product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Status
                                    </Col>
                                    <Col>
                                        {product.countInStock > 0 ? 'In stock': 'Out of stock' }
                                    </Col>
                                </Row>
                                </ListGroup.Item>

                                    {product.countInStock > 0 && 
                                        ( 
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                <Form.Control as='select'
                                                value = {qty} 
                                                onChange={(e) => setQty(e.target.value)} >
                                                        {
                                                            [...Array(product.countInStock).keys()]
                                                                .map( x => (
                                                                    <option key={x + 1}
                                                                    value={x + 1} >
                                                                    {x + 1}
                                                                </option>
                                                                ))
                                                        }
                                                                  
                                                        </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        )
                                    }

                            <ListGroup.Item>
                                        <Button
                                    onClick={addToCartHandler}
                                    className='btn-block'
                                    type='button'
                                    disabled={product.countInStock === 0 }    
                                >
                                    Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && <Message>No reviews</Message> }
                    <ListGroup variant='flush'>
                        {product.reviews.map(review => (
                            <ListGroup.Item key={review._id} >
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} color='blue'/>
                            <p>{review.createdAt.substring(0,10)}</p>
                            <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                            <h2>Write a customer review</h2>
                            {errorReview && <Message variant='danger'>
                            {errorReview}</Message>}
                            { userInfo ? 
                            (<Form onSubmit={submitHandler}>
                                <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control as='select' value={rating}
                                     onChange={(e) => setRating(e.target.value) }
                                    >
                                        <option value=''>Select ...</option>
                                        <option value='1'>1 - Poor</option>
                                        <option value='2'>2 - Fair</option>
                                        <option value='3'>3 - Good</option>
                                        <option value='4'>4 - VeryGood</option>
                                        <option value='5'>5 - Excellent</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='comment' >
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as='textarea' 
                                 row='3' 
                                 value={comment}
                                 onChange={(e)=> setComment(e.target.value)}
                                 ></Form.Control>
                                </Form.Group>
                                <Button type='submit' variant='primary'>
                                    Submit
                                </Button>
                            </Form>):
                            (<Message>Please <Link to='/login'>
                                sign in</Link> to write a review</Message>)}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            </>        
            )
            }
            
        </>
    )
}

export default ProductScreen
