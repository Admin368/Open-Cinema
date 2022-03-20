import React from "react";

import AppLayout from "../layouts/layout2/AppLayout";

import './style.less';

const index = props => {
  return (
    <AppLayout 
      // showLogo={false}
      showCrumbs={false}
      showMenus={false}
      // showFooter={false}
    >
      <div className="text">Sample Page</div>
    </AppLayout>
  );
};

export default index;
