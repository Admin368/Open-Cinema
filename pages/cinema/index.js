import React from "react";

import AppLayout from "../../components/AppLayout";
import Player from "../../components/Player";

import './style.less';

const backup = props => {
  return (
    <AppLayout>
      <div className="text">Sample Page</div>
      <Player></Player>
    </AppLayout>
  );
};

export default backup;
