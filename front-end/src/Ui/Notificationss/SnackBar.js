import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
//notification for freind request

const SimpleSnackbar = props => {
  const [open, setOpen] = React.useState(false);
  const [notifications,setNotifications] = React.useState([])

  const handleClick = () => {
    setOpen(true);
  };
  useEffect(()=>{
    console.log(props.notifications.length)
    console.log(notifications.length)

    if(props.notifications.length!==notifications.length){
      
      setNotifications(props.notifications)
      handleClick();
    }
   
  },[props.notifications])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="New Friend Request"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              Close
            </Button>
           
          </React.Fragment>
        }
      />
    </div>
  );
}

export default SimpleSnackbar;