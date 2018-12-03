'use strict';
/**
 * Hyperledger Composer business network definition: Script file
 */

let NS = 'com.cegeka';
let factory = getFactory();

async function generateRandomId(assetRegistry) {
  const LENGTH = 7;
  do {

    let number = '';
    while (number.length < LENGTH) {
      number = number + (Math.floor(Math.random() * (9)) + 1);
    }

    //console.log(`Testing with new  ID ${number}`);
    //check for uniqueness
    let existing = await assetRegistry.exists(number);
    if (!existing) {
      return number;
    }

  } while (true);
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {com.cegeka.ImportTires} tires - the transaction to be processed
 * @transaction
 */
async function ImportTires(tires) { // eslint-disable-line no-unused-vars

  if (!tires.importer || tires.importer.role != 'Manufacturer') {
    throw new Error('Only manufacturers can import tires');
  }
   
  const assetRegistry = await getAssetRegistry(`${NS}.CarTire`);
  let newTires = [];

  for(let i=0; i < tires.tireCount; i++) {
    let newTire = factory.newResource(NS, 'CarTire', await generateRandomId(assetRegistry));

    newTire.owner = tires.importer;
    newTire.status = 'Created';
    newTire.creationDate = tires.timestamp;
  
    newTires.push(newTire);
  }

  await assetRegistry.addAll(newTires);
}

/**
 * @param {com.cegeka.Sell} tx - the transaction to be processed
 * @transaction
 */
async function Sell(tx) { // eslint-disable-line no-unused-vars

  if (!tx.tire || !tx.seller || !tx.newOwner) {
    throw new Error('Missing required information');
  }

  if (tx.tire.status != 'Created' && tx.tire.status != 'Sold') {
    throw new Error('Tire cannot be resold');
  }

  if (tx.tire.owner != tx.seller) {
    throw new Error('Tire can only be sold by its owner');
  }

  tx.tire.owner = tx.newOwner;
  tx.tire.status = 'Sold';
  tx.tire.sellDate = tx.timestamp;

  const assetRegistry = await getAssetRegistry(`${NS}.CarTire`);

  await assetRegistry.update(tx.tire);
}

/**
 * @param {com.cegeka.SellToEndCustomer} tx - the transaction to be processed
 * @transaction
 */
async function SellToEndCustomer(tx) { // eslint-disable-line no-unused-vars

  if (!tx.tire || !tx.seller || !tx.vinNumber) {
    throw new Error('Missing required information');
  }

  if (tx.tire.status != 'Sold') {
    throw new Error('Tire cannot be sold to end customer');
  }

  if (tx.tire.owner != tx.seller) {
    throw new Error('Tire can only be sold by its owner');
  }

  //Check if we already registerd a car with this VIN number
  const vehicleRegistry = await getParticipantRegistry(`${NS}.Vehicle`);

  let ownerVehicle = undefined;
  if(await vehicleRegistry.exists(tx.vinNumber)) {
    // Add tire to an existing vehicle
    ownerVehicle = await vehicleRegistry.get(tx.vinNumber);

    ownerVehicle.tiresOwned++;
    await vehicleRegistry.update(ownerVehicle);
  
  } else {
    // Must create a new Vehicle for this tire
    ownerVehicle = factory.newResource(NS, 'Vehicle', tx.vinNumber);
    ownerVehicle.tiresOwned = 1;

    await vehicleRegistry.add(ownerVehicle);
  }

  tx.tire.owner = undefined;
  tx.tire.status = 'BeingUsed';
  tx.tire.vehicle = ownerVehicle;
  tx.tire.sellDate = tx.timestamp;

  const assetRegistry = await getAssetRegistry(`${NS}.CarTire`);
  await assetRegistry.update(tx.tire);
}


/**
 * @param {com.cegeka.Recycle} tx - the transaction to be processed
 * @transaction
 */
async function Recycle(tx) { // eslint-disable-line no-unused-vars

  if (!tx.vehicle || !tx.recycling) {
    throw new Error('Missing required information');
  }

  if (tx.recycling.role != 'Recycling') {
    throw new Error('Only Recycling companies can recycle tires');
  }

  const vehicleRegistry = await getParticipantRegistry(`${NS}.Vehicle`);
  const assetRegistry = await getAssetRegistry(`${NS}.CarTire`);

  let allTires = await assetRegistry.getAll();
  let tires = allTires.filter(t => t.status == 'BeingUsed' && t.vehicle.getIdentifier() == tx.vehicle.getIdentifier());
  
  if (tires.length == 0) {
    throw new Error(`No recyclable tires assigned to car with VIN ${tx.vehicle.vinNumber}`);
  }  
 
  tx.vehicle.tiresOwned-= tires.length;
  await vehicleRegistry.update(tx.vehicle);
  
  for(let i = 0; i < tires.length; i++) {
    let tire = tires[i];
    tire.owner = tx.recycling;
    tire.status = 'Recycled';
    tire.vehicle = undefined;
    tire.recycleDate = tx.timestamp;

    let tireEvent = factory.newEvent(NS, 'ObtainRecyclingFee');
    tireEvent.tire = tire;
    tireEvent.recycling = tx.recycling;
    emit(tireEvent);  
  }
  
  await assetRegistry.updateAll(tires);
}
