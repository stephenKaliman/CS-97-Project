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
import FeedPost from './FeedPost';

function Explore (){
  const [state, setState] = useState([]);
  const [users, setUsers] = useState(true);
  // change to false when we want to show a single selected
  // user's workouts
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
    useEffect(async () => {
    if(!loading) return;
    setLoading(false);
    const posts = await API.get('/users', createHeader(window.localStorage.getItem('jwt')));
    setState(posts.data);
  }, []);

  const displayResult = (data, usertf, username) => {
     setLoading(true);
     setState(data);
     setUsers(usertf);
     setUsername(username);
     setLoading(false);
  }
if(loading){console.log("loading");
	return(<div>
    		<ExploreBar displayResult={displayResult}/>
	        </div>);
}else{
if(users){console.log("users");
          return(
	     <div>
    		<ExploreBar displayResult={displayResult}/>
	        <h1>Select a user to view their workouts: </h1>
		<div className="App">
		{
		   state.map(post => {
		   return <UserInfo
			   displayResult={displayResult}
			   id={post.id}
			   name={post.username}
		  />
                  })
		}
		</div>
	     </div>
	  );
}else{console.log("workouts");
  return (
	  <div>
    		<ExploreBar displayResult={displayResult}/>
		<h1>{username}'s profile:</h1>
		<div className="App">
    		{
     		state.map(post => {
		    return <FeedPost
		    			id={post.id}
          	  name={post.name}
	            image={post.image}
							image2={post.image2}
	            likes={post.likes}
	            liked={post.liked}
	            likeable={true}
	            muscleGroup={post.muscleGroup}
	            type={post.type}
	            equipment={post.equipment}
	            difficulty={post.difficulty}
							directions={post.description}
	            />
	    	})
    	  }
    </div>
  </div>
  );
 }
}
}

export default Explore;
