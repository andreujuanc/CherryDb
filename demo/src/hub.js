let socket = null;
const hub ={
    setSocket: (io)=>{
        socket = io;
    },
    dataChanged: ()=>{
        console.log('broadcasting data changed')
        socket.emit('datachanged', { time: Date.now() });
    } 
}
export default hub;