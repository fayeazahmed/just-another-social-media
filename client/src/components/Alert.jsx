import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setMounted(false);
    }, 3000);
  }, [alerts]);

  return alerts !== null && alerts.length > 0 ? (
    <div className={`notifications ${mounted && "opacity-1"}`}>
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
