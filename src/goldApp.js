import SwaggerUI from 'swagger-ui-react';
import './swagger-ui.css';
import Mermaid from './mermaid.jsx';

export default App;

const mermaidMap = new Map();
const mermaidRegex=/```mermaid([\s\S]*?)```/;

function App() {
	return (
		<div className="App">
			<SwaggerUI 
				url={window.location.href+"petstore.yaml"}
				docExpansion="list" 
				plugins= {[CleanMainDescriptionPlugin, CleanOperationDescriptionPlugin, RenderMermaidOperationPlugin]}
			/>
		</div>
	);
}

const CleanMainDescriptionPlugin = function() {
	return {
		wrapComponents: {
		 
			info: (Original, { React }) => props => {
				const { info } = props;
				const originalDescription = info.get("description");
				const m=originalDescription.match(mermaidRegex);
			
				if (m!=null)
				{
					mermaidMap.set("info.description",m[1]);
					const updatedDescription=originalDescription.replace(mermaidRegex,"");
					return React.createElement("div",{...props},
													React.createElement(Original,{...props,info: info.setIn(["description"], updatedDescription)})
													,<div><Mermaid chart={m[1]} /></div>)
				}
			
				else return React.createElement(Original, props)
		  }
    }
  }
}

const RenderMermaidOperationPlugin = function(system) {
	return {
		wrapComponents: {
			
			parameters: (Original, system) => (props) => {
				const { operation } = props
				const operationId=operation.get("operationId");

				if (mermaidMap.has(operationId) === true) {
		
					var m=mermaidMap.get(operationId);
					return	<div>
								<div>
									<br />
									<Mermaid chart={m} />
									<br /> 
								</div>
								<Original {...props} />
							</div>
				}
			
				else{
					return <Original {...props} />
				}
		  }
		}
	}
}

const CleanOperationDescriptionPlugin = function() {
	return {
		wrapComponents: {
			 
			operation: (Original, { React }) => props => {
				const { operation } = props
				const operationId = operation.getIn(["op", "operationId"])
			
				if ( operation.get("op").size !== 0)
				{	
					const originalDescription = operation.getIn(["op", "description"])
					const m=originalDescription.match(mermaidRegex);
			  
					if (m!=null)
					{
						mermaidMap.set(operationId,m[1]);
						
						const updatedDescription=originalDescription.replace(mermaidRegex,"");
						return React.createElement(Original, {...props, operation: operation.setIn(["op", "description"], updatedDescription)})
					}
				}
			
				return React.createElement(Original, props)
			}
		}
	}
}

