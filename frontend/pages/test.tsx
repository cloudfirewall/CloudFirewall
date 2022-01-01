import axios from 'axios'
import useSWR from 'swr'

export default function Test () {
  const fetcher = (url) => axios.get(url).then(res => {
      console.log(res);
      return res;
    })

   // Add these lines
  const { data, error } = useSWR('http://localhost:8000/todos/1', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  // render data below
  return (<>
  Look the data is available here!
  <pre>
      {JSON.stringify(data)}
  </pre>
  </>)

}