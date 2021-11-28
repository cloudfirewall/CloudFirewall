import * as React from 'react';

type Props = {

}

const EmptyInstancePage: React.FC<Props> = ({}) => {

  return(
    <div className="">
        <div className="flex flex-col justify-end items-center h-52 py-4">
            <h5>Seems you have no instance available!</h5>
            <p className="text-info">Create a new instance to show up here.</p>
            <button className="btn btn-md btn-success w-40">
              + New Instance
            </button>
        </div>
    </div>
  );
}

export default EmptyInstancePage;