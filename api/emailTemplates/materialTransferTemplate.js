function materialTransferTemplate(materialTransfer) {
	return (
		`<html>
		<body style="font-family: Arial, sans-serif; margin: 20px; color: #333">
		<div style="border: 1px solid #000; padding: 20px">
		  <h2 style="text-align: center; margin-bottom: 10px">
			Material Transfer Report
		  </h2>
		  <p><strong>MT Number:</strong> MT${materialTransfer._id}</p>
		  <p><strong>Created By:</strong> ${materialTransfer.createdBy}, ${materialTransfer.origination}</p>
		  <p><strong>Created Date:</strong> ${new Date(materialTransfer.createdAt).toDateString()}</p>
	
		  <h3
			style="
			  margin-top: 20px;
			  border-bottom: 1px solid #000;
			  padding-bottom: 5px;
			"
		  >
			Details
		  </h3>
		  <p><strong>Attn To:</strong></p>
		  <p><strong>Origination:</strong>${materialTransfer.origination}</p>
		  <p><strong>Destination:</strong>${materialTransfer.destination}</p>
	
		  <h3
			style="
			  margin-top: 20px;
			  border-bottom: 1px solid #000;
			  padding-bottom: 5px;
			"
		  >
			Cautions
		  </h3>
		  <p>None</p>
	
		  <h3
			style="
			  margin-top: 20px;
			  border-bottom: 1px solid #000;
			  padding-bottom: 5px;
			"
		  >
			Assets
		  </h3>
		  <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
			<thead>
			  <tr style="background-color: #f0f0f0">
				<th style="border: 1px solid #000; padding: 8px">Asset Number</th>
				<th style="border: 1px solid #000; padding: 8px">Description</th>
				<th style="border: 1px solid #000; padding: 8px">Make</th>
				<th style="border: 1px solid #000; padding: 8px">Model</th>
				<th style="border: 1px solid #000; padding: 8px">Serial Number</th>
				<th style="border: 1px solid #000; padding: 8px">Condition</th>
				<th style="border: 1px solid #000; padding: 8px">
				  Transfer Reason
				</th>
			  </tr>
			</thead>
			<tbody>
			  ${materialTransfer.assets
			.map(
				(asset) => `
				<tr>
				  <td style="border: 1px solid #000; padding: 8px">${asset.assetNumber}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.description}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.make}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.model}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.serialNumber}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.condition}</td>
				  <td style="border: 1px solid #000; padding: 8px">${asset.transferReason}</td>
				</tr>
			  `
			)
			.join("")}
			</tbody>
		  </table>
	
		  <h3
			style="
			  margin-top: 20px;
			  border-bottom: 1px solid #000;
			  padding-bottom: 5px;
			"
		  >
			Workflow
		  </h3>
		  <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
			<thead>
			  <tr style="background-color: #f0f0f0">
				<th style="border: 1px solid #000; padding: 8px">Step</th>
				<th style="border: 1px solid #000; padding: 8px">Status</th>
				<th style="border: 1px solid #000; padding: 8px">Completed By</th>
				<th style="border: 1px solid #000; padding: 8px">Date</th>
				<th style="border: 1px solid #000; padding: 8px">Comments</th>
			  </tr>
			</thead>
			<tbody>
			  <tr>
				<td style="border: 1px solid #000; padding: 8px">FOR REBUILD</td>
				<td style="border: 1px solid #000; padding: 8px">Rig 27</td>
				<td style="border: 1px solid #000; padding: 8px">Manager</td>
				<td style="border: 1px solid #000; padding: 8px">
				  4/9/2024 9:16:08 PM
				</td>
				<td style="border: 1px solid #000; padding: 8px">None</td>
			  </tr>
			</tbody>
		  </table>
	
		  <p style="margin-top: 20px; font-size: 0.8em; text-align: center">
			© 2024 Max Maintenance | Proprietary and confidential
		  </p>
		</div>
	  </body>
	  </html>
	`
	)

}

export default materialTransferTemplate