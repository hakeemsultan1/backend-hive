function workOrderTemplate(workOrder) {
  return (
    `<body style="font-family: Arial, sans-serif; margin: 20px; color: #333">
    <div style="border: 1px solid #000; padding: 20px">
      <h2 style="text-align: center; margin-bottom: 10px">Work Order</h2>

      <p><strong>WO Number:</strong> UWO${workOrder._id}</p>
      <p><strong>WO Type:</strong> ${workOrder.type} Work Order</p>
      <p><strong>Status:</strong> ${workOrder.status}</p>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Asset Details
      </h3>
      <p><strong>Asset Number:</strong> ${workOrder.asset.name}</p>
      <p><strong>Asset Description:</strong> ${workOrder.asset.description}</p>
      <p><strong>Division/District:</strong> US - Texas</p>
      <p><strong>Serial Number:</strong> ${workOrder.asset.serialNumber}</p>
      <p><strong>Cost Center/Zone:</strong> ${workOrder.asset.physicalLocation}</p>
      <p><strong>Asset Class:</strong> Drilling Systems - Mast</p>
      <p><strong>Criticality Factor:</strong> ${workOrder.asset.criticality}</p>
      <p><strong>Operational Downtime:</strong> No</p>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Special Details
      </h3>
      <p><strong>Height:</strong> 141.5</p>
      <p><strong>Setback Capacity:</strong> 650,000</p>
      <p><strong>Hookload Capacity:</strong> 1,000,000 LBS</p>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Man Hours
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
        <thead>
          <tr style="background-color: #f0f0f0">
            <th style="border: 1px solid #000; padding: 8px">Hours</th>
            <th style="border: 1px solid #000; padding: 8px">Start Date</th>
            <th style="border: 1px solid #000; padding: 8px">End Date</th>
            <th style="border: 1px solid #000; padding: 8px">Assigned To</th>
            <th style="border: 1px solid #000; padding: 8px">Company</th>
            <th style="border: 1px solid #000; padding: 8px">Rate</th>
            <th style="border: 1px solid #000; padding: 8px">Comments</th>
          </tr>
        </thead>
        <tbody>
          ${workOrder.manHours.map(
      (manHour) => `
            <tr>
            <td style="border: 1px solid #000; padding: 8px">${manHour.manHours}</td>
            <td style="border: 1px solid #000; padding: 8px">${new Date(manHour.createdAt).toDateString()}</td>
            <td style="border: 1px solid #000; padding: 8px">${new Date(manHour.updatedAt).toDateString()}</td>
            <td style="border: 1px solid #000; padding: 8px">${manHour.performedBy.name}</td>
            <td style="border: 1px solid #000; padding: 8px">-</td>
            <td style="border: 1px solid #000; padding: 8px">${manHour.rate}</td>
            <td style="border: 1px solid #000; padding: 8px">${manHour.comment}</td>
          </tr>`)}
        </tbody>
      </table>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Cost Details
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
        <thead>
          <tr style="background-color: #f0f0f0">
            <th style="border: 1px solid #000; padding: 8px">Cost Type</th>
            <th style="border: 1px solid #000; padding: 8px">Item</th>
            <th style="border: 1px solid #000; padding: 8px">Quantity</th>
            <th style="border: 1px solid #000; padding: 8px">Description</th>
            <th style="border: 1px solid #000; padding: 8px">Cost Each</th>
            <th style="border: 1px solid #000; padding: 8px">Currency</th>
          </tr>
        </thead>
        <tbody>
          ${workOrder.costs.map((cost) => `
          <tr>
            <td style="border: 1px solid #000; padding: 8px">${cost.costType}</td>
            <td style="border: 1px solid #000; padding: 8px">${cost.item}</td>
            <td style="border: 1px solid #000; padding: 8px">${cost.quantity}</td>
            <td style="border: 1px solid #000; padding: 8px">${cost.description}</td>
            <td style="border: 1px solid #000; padding: 8px">${cost.costEach}</td>
            <td style="border: 1px solid #000; padding: 8px">${cost.currency}</td>
          </tr>`)}
        </tbody>
      </table>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Delay Reasons
      </h3>
      <p>No data available</p>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Work Order Inventory
      </h3>
      <p>No data available</p>

      <h3
        style="
          margin-top: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        "
      >
        Comments
      </h3>
      <p>
        <strong>${workOrder.summary}</strong>
      </p>
      <p><strong>Action Taken:</strong> None</p>

      <p style="margin-top: 20px; font-size: 0.8em; text-align: center">
        © 2024 Max Maintenance | Proprietary and confidential
      </p>
    </div>
  </body>`
  )
}

export default workOrderTemplate