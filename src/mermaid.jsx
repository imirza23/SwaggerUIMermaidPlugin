import React from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
 startOnLoad: true,
 theme: 'default',
 securityLevel: 'loose',
 fontFamily: 'monospace',
});
export default class Mermaid extends React.Component {
 componentDidMount() {
 mermaid.contentLoaded();
 }
 render() {
 return <div className="mermaid">{this.props.chart}</div>;
 }
}