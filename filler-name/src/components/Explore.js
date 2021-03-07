import './Feed.css';
import {
  useState,
  useEffect
} from 'react';
import {
  UserInfo
} from '.';
import {
  API,
  createHeader
} from '../constants';
import ExploreBar from './ExploreBar';

function Explore (){
  const [state, setState] = useState([]);
  const [users, setUsers] = useState(true);
  // change to false when we want to show a single selected
  // user's workouts
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    if(!loading) return;
    setLoading(false);
    const posts = await API.get('/users', createHeader(window.localStorage.getItem('jwt')));
    setState(posts.data);
  });

  const displayResult = data => {
    setState(data);
  }

  return (
  <div>
    <ExploreBar displayResult={displayResult}/>

    <div className="App">
    {
        state.map(post => {
          return <UserInfo displayResult={displayResult} id={post.id} name={post.username}/>
        })
    }
    </div>
  </div>
  );
}

export default Explore;
