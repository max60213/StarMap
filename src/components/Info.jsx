function Info(props) {
  return (
    <div className={`info ${props.className == undefined ? "" : props.className}`}>
      <h1>Info</h1>
    </div>
  );
}

export default Info;