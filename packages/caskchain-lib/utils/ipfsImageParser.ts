export const ipfsImageParser = (image: string) => {
  const mainImage = `${image}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`;
  return mainImage;
};
