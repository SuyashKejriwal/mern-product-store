import React,{ useState,useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductCreateScreen = ({history}) => {

    const [name,setName]=useState('');
    const [price,setPrice]=useState(0);
    const [image,setImage]=useState('');
    const [brand,setBrand]=useState('');
    const [category,setCategory]=useState('');
    const [countInStock,setCountInStock]=useState(0);
    const [description,setDescription]=useState('');
    const [uploading,setUploading]=useState(false);

    const dispatch = useDispatch();

    const userLogin=useSelector(state => state.userLogin)
    const  { userInfo }=userLogin

    const productCreate=useSelector((state) => state.productCreate)
    const { loading: loadingCreate,
            success: successCreate, 
            error: errorCreate, 
             }= productCreate

    useEffect(() => {
        console.log(successCreate);
        if(userInfo===undefined || !userInfo.isAdmin){
          // will run in case of logout redirect to login page
          history.push('/login');
       }else{
        if(successCreate){
          dispatch({type: PRODUCT_CREATE_RESET })
          history.push(`/admin/productlist`);
       }
       }
      
    } , [history,dispatch,successCreate,userInfo])

    const uploadFileHandler = async (e)=> {
      const file=e.target.files[0]
      console.log(uploading);
      const formData=new FormData()
      formData.append('image',file)
      setUploading(true)
      console.log(uploading);
      try{
        const config={
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data }= await axios.post('/api/upload',formData,config)

      setImage(data)
      setUploading(false)
      }catch(error){
        console.log(error);
        setUploading(false);
      }

    }

    const submitHandler=(e) => {
      e.preventDefault();
      const newproduct={
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description
      }
      console.log(newproduct);
      dispatch(createProduct(newproduct));
    }

    return (
        <>
          <Link to='/admin/productlist' className='btn btn-light my-3'>
          Go Back
          </Link>
          <FormContainer>
              <h1>Create Product</h1>
              {loadingCreate && <Loader />}
              {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
              <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Create 
            </Button>
            </Form>
          </FormContainer>  
        </>
    )
}

export default ProductCreateScreen
