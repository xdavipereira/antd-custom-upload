import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "antd/dist/antd.css";
import Upload from "antd/lib/upload";

export function genPercentAdd() {
  let k = 0.1;
  const i = 0.01;
  const end = 0.98;
  return function(s: number) {
    let start = s;
    if (start >= end) {
      return start;
    }

    start += k;
    k = k - i;
    if (k < 0.001) {
      k = 0.001;
    }
    return start * 100;
  };
}

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return <div>{this.props.render(this.state)}</div>;
  }
}

class App extends React.Component {
  onCustomRequest = event => {
    console.log(event.data);
    return new Promise((resolve, reject) => {
      const ajaxResponseWasFine = true;
      const getPercent = genPercentAdd();
      let curPercent = 0;
      setInterval(() => {
        curPercent = getPercent(curPercent);
        event.onProgress({
          percent: curPercent
        });
      }, 200);
      setTimeout(() => {
        event.onProgress({ percent: 50 });
        if (ajaxResponseWasFine) {
          resolve(event.onSuccess("done", event.file));
          console.log("File Info:", event.file);
        } else {
          reject(event.onError());
        }
      }, 1000);
    });
  };
  customRequest = (file, filelist, event) => {};
  render() {
    return (
      <Wrap
        render={mouse => (
          <div>
            <h1>{mouse.count}</h1>
            <Upload
              onChange={this.customRequest}
              customRequest={this.onCustomRequest}
            >
              <h1>Salvar</h1>
            </Upload>
          </div>
        )}
      />
    );
  }
}

render(<App />, document.getElementById("root"));
