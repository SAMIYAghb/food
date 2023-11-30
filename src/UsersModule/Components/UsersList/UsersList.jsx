import Header from "../../../SharedModule/Components/Header/Header"
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../Constants/ApiUrl";
import { toast, ToastContainer } from 'react-toastify';
import nodata from "../../../assets/images/nodata.png";
import Nodata from './../../../SharedModule/Components/Nodata/Nodata';

const UsersList = ({title, paragraph}) => {
  const imgUrl = 'https://upskilling-egypt.com/';
 
  const[usersList, setUsersList] = useState([]);
  const[itemId, setItemId] = useState(0);

  // modal
  const [modalState, setModalState] = useState("close");
 
  const showDeleteModal = (id) => {
    // console.log(id, "deleted");
    setItemId(id); //pour l'envoyé a l API
    setModalState("delete-modal");
  };
  const handleClose = () => setModalState("close");
   // modal


   const getUsersList = async() =>{
    await axios
    .get(baseUrl + "Users/?pageSize=10&pageNumber=1", {
      headers: {
        //pour obtenir les users on doit étre login 'authorized'
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    .then((response) => {
      // console.log(response.data.data);
      setUsersList(response?.data?.data);
    })
    .catch((error) => {
      console.log(error);
    });
   }

   const deleteUser = async(itemId)=>{
    // console.log(id, 'deleted');
    await axios
    .delete(baseUrl + `Users/${itemId}`, {
      headers: {
        //pour obtenir les users on doit étre login 'authorized'
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    .then((response) => {
      // console.log(response.data.data);
      toast.success("User Deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: "undefined",
        theme: "colored",
      });
      getUsersList();
      handleClose();
    })
    .catch((error) => {
      console.log(error);
    });
   }

   useEffect(() => {
    getUsersList();
   },[]);


  return (<>
  <ToastContainer/>
  <Header title={'Users List'} paragraph={'You can now add your items that any user can order it from the Application and you can edit'} />
    
    {/* modal delete User*/}
      <Modal
        show={modalState === "delete-modal"}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <Modal.Header closeButton></Modal.Header>
          <div className="text-center">
            <img src={nodata} alt="dalate-img" className="w-50" />
            <h3>Delete This User?</h3>
            <p className="text-muted">
              are you sure you want to delete this item ? if you are sure just
              click on delete it
            </p>
            <div className="text-end">
              <button 
                onClick={()=>{deleteUser(itemId)}}
                className="btn btn-outline-danger w-50 ">
                Delete this item
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/*end modal delete User*/}
    
    <div className="row align-items-center justify-content-between rounded-3 p-4">
        <div className="col-md-6">
          <h3>Users Table Details</h3>
          <p>You can check all details</p>
        </div>

        <div className="">
      {
        usersList.length > 0 
        ? (

            <table className="table">
              <thead>
                <tr className="text-center">
                  <th scope="col">#</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>            
                {
                  usersList.map((user, index)=>(
                    <>
                    <tr className="text-center" key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td scope="row">{user?.userName}</td>
                      <td>
                        <div className="img-container">
                          {
                            user.imagePath ?(
                              <img src={imgUrl + user.imagePath} 
                              alt="recipe-image"
                              className="w-100 img-fluid" />
                            )
                            : 
                              (
                              <img src={nodata} alt="recipe-image"
                              className="w-100 img-fluid"/>
                              )
                          }
                          
                        </div>                       
                        </td>
                      <td>{user?.phoneNumber}</td>
                      <td>
                        <i
                          onClick={()=>{showDeleteModal(user.id)}}
                          className="fa fa-trash text-danger"
                        ></i>
                      </td>
                    </tr>
                    </>
                  ))
                }
              </tbody>
            </table>

          )
          : (
              <Nodata />
          )
      }
            
        
        </div>
      </div>
  </>
  )
}

export default UsersList