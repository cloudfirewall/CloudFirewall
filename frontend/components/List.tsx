import * as React from 'react';

type Props = {

}

const List: React.FC<Props> = ({children}) => {

  return(
<ul className="divide-y divide-gray-100">
      {children}
    </ul>
  );
}

export default List;