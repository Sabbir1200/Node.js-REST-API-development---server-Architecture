import type { IncomingMessage, ServerResponse } from "node:http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async(
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // console.log(req)
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  //   console.log(urlParts)
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
    // console.log(id)
  if (url === "/products" && method === "GET") {
    // const products = [
    //     {
    //         id: 1,
    //         name: "Product - 1"
    //     },
    // ]
    const products = readProduct();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrieve successfully",
        data: { products },
      }),
    );
  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p :IProduct)=>p.id === id)
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrieve successfully",
        data: { product },
      }),
    );
  } else if(method === "POST" && url === '/products'){
    const body = await parseBody(req);
    // console.log("Body",body);
    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body
    }
    // console.log(newProduct)
    products.push(newProduct)
    insertProduct(products)
     res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products created successfully",
        data: newProduct,
      }),
    );

  }
};
