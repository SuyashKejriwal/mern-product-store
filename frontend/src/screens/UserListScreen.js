import React, {useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux' 
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers,deleteUser,logout } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserListScreen = ({history}) => {
    const dispatch = useDispatch();

    const userList=useSelector(state => state.userList)

    const userLogin=useSelector(state => state.userLogin)
    const  { userInfo }=userLogin

    const { loading,error,users }=userList

    const userDelete=useSelector(state=> state.userDelete)
    const { loading: loadingDelete, 
            success: successDelete,
            error: errorDelete }=userDelete

    const userUpdate=useSelector(state=> state.userUpdate)
    const { success:successUpdate,
            user:updatedUser }=userUpdate

    useEffect(() => {
        
        if(userInfo && userInfo.isAdmin){
            if(successUpdate && updatedUser.name===userInfo.name && !updatedUser.isAdmin){
                // will run if admin demotes itself to user.
                // it should first logout and then load login page.
                dispatch(logout());
            }else{
            dispatch(listUsers());
           dispatch({type: USER_UPDATE_RESET });
            }
        }else{
            // will run in case of logout redirect to login page
            history.push('/login')
        }
        
    }, [dispatch,history,userInfo,successDelete,successUpdate])

    const deleteHandler=(id) => {

        if(window.confirm('Are you sure you want to delete this user')){
            dispatch(deleteUser(id));
        }
       
    }

    return (
        <>
         <h1>Users</h1>
         {loadingDelete && <Loader/>}
         {errorDelete && <Message>{errorDelete}</Message>}
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
                          <th>EMAIL</th>
                          <th>ADMIN</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      {users.map(user => (
                          <tr key={user._id} >
                              <td>{user._id}</td>
                              <td>{user.name}</td>
                              <td><a href={`mailto: ${user.email}`} > {user.email}</a></td>
                              <td>
                               {user.isAdmin ? 
                               (<i className='fas fa-check' style={
                                   {color : 'green'}
                               }></i>) :
                               (<i className='fas fa-times' style={
                                   {color: 'red'}
                               }></i>)
                               }
                              </td>
                              <td>
                                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                  </LinkContainer>
                                  <Button variant='danger' className='btn-sm' onClick={
                                      ()=> deleteHandler(user._id)
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

export default UserListScreen
