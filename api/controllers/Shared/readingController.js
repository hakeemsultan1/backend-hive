async function pdfGenerate(req, res) {
    try {
        let data = req.body;
        // let pdfData = await generatePdf(data);
        return res.status(200).json({ data: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { pdfGenerate }