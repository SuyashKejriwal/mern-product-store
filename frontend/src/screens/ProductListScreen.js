import React, {useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux' 
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts,
         deleteProducts,
         createProducts
         } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = ({history,match}) => {
    const dispatch = useDispatch();

    const productList=useSelector(state => state.productList)
    const { loading,error,products }=productList

    const userLogin=useSelector(state => state.userLogin)
    const  { userInfo }=userLogin

    const productDelete=useSelector(state=> state.productDelete)
    const { loading:loadingDelete, 
            success: successDelete,
            error: errorDelete }=productDelete

    const productCreate=useSelector(state=> state.productCreate)
    const { loading:loadingCreate,
            success: successCreate,
            error: errorCreate,
            product: createdProduct }=productCreate

    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_RESET })
        if(!userInfo.isAdmin){
            // will run in case of logout redirect to login page
            history.push('/login')   
        }

        if(successCreate){
            // will run if product is successfully created
            // redirect to product edit screen
            history.push(`/admin/product/${createdProduct._id}/edit`)

        }else{
            dispatch(listProducts());
        }
        
    }, [dispatch,history,userInfo,successDelete,successCreate,createdProduct])

    const deleteHandler=(id) => {

        if(window.confirm('Are you sure you want to delete this Product')){
            // DELETE PRODUCTS
            dispatch(deleteProducts(id));
        }
       
    }

    const CreateProductHandler=() => {

    }

    return (
        <>
        <Row className='align items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-right'>
                <Button className='my-3' onClick={CreateProductHandler}>
                    <i className='fas fa-plus'></i> Create Product
                </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader/>}
        {errorDelete && <Message variant='danger' >{errorDelete}</Message>}
         {loading ?
          <Loader />:
          error ?
          <Message variant="danger">{error}</Message> :
          (
              <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>NAME</th>
                          <th>PRICE</th>
                          <th>CATEGORY</th>
                          <th>BRAND</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      {products.map(Product => (
                          <tr key={Product._id} >
                              <td>{Product._id}</td>
                              <td>{Product.name}</td>
                              <td>Rs. {Product.price}</td>
                              <td>{Product.category}</td>
                              <td>{Product.brand}</td>
                              <td>
                                  <LinkContainer to={`/admin/product/${Product._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                  </LinkContainer>
                                  <Button variant='danger' className='btn-sm' onClick={
                                      ()=> deleteHandler(Product._id)
                                  } >
                                    <i className='fas fa-trash'></i>
                                  </Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </Table>
          )
          }   
        </>
    )
}

export default ProductListScreen
