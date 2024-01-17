import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaFolderOpen } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { MdClose, MdMoreVert,MdDelete,MdCreateNewFolder} from 'react-icons/md';
import { useUser } from './../../Auth/UserContext';
import { FaFileArchive, FaFile, FaFileImage } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';
import { BiSolidFolderPlus } from "react-icons/bi";
import { FaFileCirclePlus } from "react-icons/fa6";
import {BiSolidFilePdf} from 'react-icons/bi';
import {BsFiletypeXls, BsFiletypePng} from 'react-icons/bs';
import {AiFillFileWord} from 'react-icons/ai';
import { RiErrorWarningLine } from 'react-icons/ri';
import {DELETE, GET, POST, POSTFILE} from '../../api/Axios'
import { toast } from 'react-toastify';

function App() {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const userRole=localStorage.getItem('role');
  const [uploading, setUploading] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const { folderId, folderName } = useParams();
  const [fileContent, setFileContent] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null); // Add this line
  const [success, setSucess] = useState(0); // Add this line
  const [file, setFile] = useState({
    name:'',
    file:null
  });
  const [fileList, setFileList] = useState([]);

  const { user } = useUser();

  const GetFiles=async ()=>{
    const response=await GET('/file',setLoading);
    if(response){
      setFileList(response.data)
    }
  }

  useEffect(() => {
    GetFiles();
  }, [success]);

  const getFolder=async ()=>{
    setUploading(true)
    const response =await GET('/folder',setUploading);
    if(response){
      setFolders(response.data);
      setUploading(false)
    }
 }


  useEffect(() => {
    getFolder();
  }, [success]);

  const handleCreateFolder = async() => {
    const response= await POST('/folder',{name:newFolderName},setLoading);
    if(response){
      setNewFolderName('');
      getFolder();
      setShowCreateModal(false);
      setSucess(success+1);
    }
  };

  const [selected, setSelected] = useState({
    id:'',
    is_folder:''
  });
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);

  // ... // -/\- \\ ... (previous code) ... // -/\- \\ ...
  const confirm_delete=(id,is_folder)=>{
    setSelected({
      id:id,is_folder:is_folder
    })
    setShowDeleteFolderModal(true);
  }


  const DeleteFolder = async (folderId) => {
    const response= await DELETE('/folder/'+folderId,setLoading);
    if(response){
      toast.success(response.data.meassage);
      setSucess(success+1);
    }
  };

    
    const handleUpload = async () => {
      setUploading(true)
      const response = await POSTFILE('/file',{...file,name:file.file.name},setUploading);
      if(response){
        toast.success(response.data.message);
        setFile({
          name:"",
          file:""
        })
      }
      setUploading(false)
      setShowUploadModal(false);
      setSucess(success+1);
    };
    
  function getFileIcon(fileType) {
    
    fileType=fileType.path.url.slice(fileType.path.url.lastIndexOf(".")+1);

    const blueColor = '#c1a1cf';
    switch (fileType) {
      case 'pdf':
        return <BiSolidFilePdf style={{ fontSize: '48px',  color: blueColor }} />;
      case 'txt':
        return <FiFileText  style={{ fontSize: '48px',  color: blueColor  }} />;
      case 'zip':
        return <FaFileArchive style={{ fontSize: '48px', color: blueColor }} />;
      case 'psd':
        return <FaFileImage style={{ fontSize: '48px',  color: blueColor }} />;
      case 'xlsx':
        return <BsFiletypeXls style={{ fontSize: '48px',  color: blueColor }} />;
      case 'docx':
        return <AiFillFileWord style={{ fontSize: '48px',  color: blueColor }} />;
        case 'png':
          return <BsFiletypePng style={{ fontSize: '48px',  color: blueColor }} />;
      default:
        return <FaFile style={{ fontSize: '48px',  color: blueColor  }} />;
    }
  }

  // const handleDownloadFile = (file) => {
  //   window.location.href = file.path.url;
  // };
  const handleDownloadFile = async (file) => {
    try {
      const fileUrl = file.path.url;
  
      const response = await fetch(fileUrl);
      const blob = await response.blob();
  
      // Determine the file type based on the file name or other information
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
  
      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob], { type: contentType }));
      link.download = file.name;
  
      // Append the link to the body
      document.body.appendChild(link);
  
      // Trigger a click event on the link
      link.click();
  
      // Remove the link from the body
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  const handleDelete = async () => {
    // console.log(selected)
    if(selected.is_folder==='folder'){
      setUploading(true)
      const response= await DELETE('/folder/'+selected.id,setUploading);
      if(response){
        toast.success(response.data.meassage);
        setSucess(success+1);
        setUploading(false)
      }
    }else if(selected.is_folder==='file'){
      setUploading(true)
      const response= await DELETE('/file/'+selected.id,setUploading);
      if(response){
        toast.success(response.data.meassage);
        setUploading(false)
        setSucess(success+1);
      }
    }
    setShowDeleteFolderModal(false);
     
  };
  
  
  return (
    <div className="container mt-4" >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Dossiers</h3>
        </div>
        {
          userRole==="admin"?
          <div >
              <button class="btn" onClick={() => setShowUploadModal(true)} ><FaFileCirclePlus style={{fontSize:'23px'}}/><span className='btntext'>Télécharger un fichier</span></button>
              <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
              <Modal.Header closeButton>
                  <Modal.Title>Télécharger un fichier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <label htmlFor="fileInput" style={{ cursor: 'pointer',border:'1px solid #dee2e6',width:'100%',height:'40px',borderRadius:'5px',padding:'7px' }}>
                    {/* Custom text for the file input */}
                    Choisir le fichier: {file.file ? file.file.name : 'Aucun fichier choisi'}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile({...file,file:e.target.files[0]})}
                    name='file'
                    id="fileInput"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    className='form-control mt-3'
                  />
                  {uploading && <p style={{ color: '#27ae60' }}>Téléchargement...</p>}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                  <button  className='btn'  onClick={() => setShowUploadModal(false)}>
                  Fermer
                  </button>
                  <button variant="primary" className='btn' onClick={handleUpload} disabled={uploading} >
                    {uploading ? 'Téléchargement...' : 'Télécharger'}
                  </button>
                </Modal.Footer>
              </Modal>
            
            
              <button class="btn btn_black" onClick={() => setShowCreateModal(true)} ><BiSolidFolderPlus style={{fontSize:'23px'}}/><span className='btntext'>Nouveau dossier</span></button>
              <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '2rem' }}>Nouveau dossier</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Entrez le nom du dossier"
                  className='form-control'
                />
                {creatingFolder && <p style={{ color: '#6b2a7d' }}>
                  Création d'un dossier...</p>}
              </Modal.Body>
              <Modal.Footer style={{ borderTop: 'none' }}>
                <button className="btn" onClick={() => setShowCreateModal(false)}>
                Fermer
                </button>
                <button className="btn" onClick={handleCreateFolder} disabled={uploading}>
                {uploading ? 'Création...' : 'Créer'}
                </button>
              </Modal.Footer>
            </Modal>
            
          </div>
          :''
        }
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className='row p-4 mt-4' >

          {
            folders.map(folder => (
              <div className='col-md-2 col-sm-6 col-6 mt-2' key={folder._id} >
                  <center>
                    <div style={{ display: 'flex', justifyContent: 'center',border:'1px solid rgba(0, 0, 0, 0.175)',borderRadius:'5px'}} >
                        <Link to={`/folders/${folder._id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '48px', color: '#6b2a7d' }}>
                          <FaFolderOpen  />
                        </span>
                          <div style={{ marginTop: '5px', color: 'black', textDecoration: 'none', whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'56px' }}>{folder.name}</div>
                      </Link>
                      <div style={{position:'absolute',right:'15px',top:'5px'}}>
                        {userRole==="admin" && (
                          <MdDelete   style={{ fontSize: '23px', color: 'black',cursor:'pointer',float:'right'}} onClick={() => confirm_delete(folder._id,'folder')}/>
                        )}
                      </div>
                    </div>
                    </center>
                  
              </div>
            ))
          }
          {Array.isArray(fileList) && fileList.map(file => (
        <div key={file._id} className='col-md-2 col-sm-6 col-6 mt-2'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',border:'1px solid rgba(0, 0, 0, 0.175)',borderRadius:'5px',cursor:'pointer'}} onClick={()=>handleDownloadFile(file)}>
              <div style={{paddingTop:'18px',paddingBottom:'5px'}}>
                <div >
                  {getFileIcon(file)}
                </div>
              <div style={{ marginTop: '7px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'56px' }}>{file.name || file.fileName}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <div className={`dropdown ${showDropdown === file._id ? 'show' : ''}`}>
               <MdMoreVert onClick={() => setShowDropdown(showDropdown === file._id ? null : file._id)} id={`fileOptions${file._id}`} style={{fontSize:'25',marginTop:'-20px',cursor:'pointer'}}/>
                
                <div className={`dropdown-menu ${showDropdown === file._id ? 'show' : ''}`} aria-labelledby={`fileOptions${file._id}`}>
                  {userRole==="admin" && (
                    <button className="dropdown-item" onClick={() => confirm_delete(file._id,'file')}>
                      <span role="img" aria-label="Delete" style={{ fontSize: '18px', marginRight: '5px' }}>🗑️</span>
                      {uploading?'Suppression':'Supprimer'}
                    </button>
                  )}
                  <button className="dropdown-item" onClick={() => handleDownloadFile(file)}>
                    <span role="img" aria-label="Download" style={{ fontSize: '18px', marginRight: '5px' }}>📥</span>
                    Télécharger
                  </button>
                </div>
              </div>
            </div>
        </div>
      ))}
        </div>
      )}
    
      <Modal show={showDeleteFolderModal} onHide={() => setShowDeleteFolderModal(false)} centered>
      <Modal.Header closeButton style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <RiErrorWarningLine className="error-icon" style={{ color: 'orange', fontSize: '80px' }} />
      </Modal.Header>
      <Modal.Body>
        <h5 style={{textAlign:'center', marginTop:'-20px'}}>Êtes-vous sûr de vouloir supprimer?</h5>
        <p style={{textAlign:'center'}}>Vous ne pourrez pas revenir en arrière!</p>
      </Modal.Body>
      <Modal.Footer style={{display:'flex', justifyContent:'center'}}>
      <button className={'btn'} onClick={()=>handleDelete()} disabled={uploading}>
          {uploading?'Suppression':'Oui, supprimez-le !'}
        </button>
        <button className={'btn'} disabled={uploading} onClick={() => setShowDeleteFolderModal(false)}>
        Annuler
        </button>
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default App;




