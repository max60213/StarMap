import { itemsData } from '../js/items-data.js';

function Info(props) {
  return (
    <div className={`info full-size ${props.className == undefined ? "" : props.className}`}>
      <h1>{}</h1>
    </div>
  );
}

export default Info;