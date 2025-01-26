// import { Box, Flex, SimpleGrid, Stack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, chakra, useRadio } from "@chakra-ui/react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { getUserMeter, getUserMeterReadingCollectionRef,getConfig, computeEnergyUsage, getSortedEnergyUsage, powerToEnergy, db } from "../../Utils/Firebase";
// import { Timestamp, collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
// import { thousandSeperator } from "../../Utils/Utils";
// import Banner from "../../components/banner";
// import OverviewSection from "../../components/overview";
// import Hero from "../../components/hero";
// import DataDisplay from "../../components/dataDisplay";

// export default function Home({globalConfig}){
//   const [user, setUser] = useState({});
//   const [userMeter, setUserMeter] = useState(null);
//   const [userMeterDateCreated, setUserMeterDateCreated] = useState("");
//   const [latestEnergyUsage, setlatestEnergyUsage] = useState(0.00);
//   const [datedEneryUsage, setdatedEneryUsage] = useState(null);
//   const [tariff, setTariff] = useState(0.00);
//   const tariffRate = 200;
//   const auth = getAuth();

//   //chart
//   const [chartIsLoading, setChartIsLoading] = useState(false);

//   useEffect(() => {
//     onAuthStateChanged(auth, async (user) => {
//       if(user){
//         setUser(user);
//         const userMeter = await getUserMeter(user.uid);

//         if(userMeter){
//           const userMeterCreated = userMeter.data().date_created;
//           const ts = userMeterCreated * 1000;
//           setUserMeter(userMeter);
//           setUserMeterDateCreated(new Date(ts).toDateString());
        

//           const unsub = onSnapshot(await getUserMeterReadingCollectionRef(user.uid), (query_snapshot) => {
//             if(!query_snapshot.empty){
//               let latest_data = query_snapshot.docs.at(-1).data();
//               computeEnergyUsage(getSortedEnergyUsage(null, userMeter.id), tariffRate)
//               .then((finalSortedData) => {
//                 console.log(finalSortedData, tariffRate);
//                 setlatestEnergyUsage(Number(finalSortedData.totalEnergy).toFixed(2));
//                 setTariff(Number(finalSortedData.totalTariff).toFixed(2));
//               })
//             }
//           });          
//         }

//       }
//     })
//   }, [])

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Reference to the MeterReadings collection
//       const readingsRef = collection(db, 'Meter', 'F2BdftS6GpAjEglZrzxf', 'MeterReadings');
//       // Create a query to order by timestamp and limit to the most recent data
//       const readingsQuery = query(readingsRef, orderBy('timestamp', 'desc'), limit(1));

//       // Set up a real-time listener
//       const unsubscribe = onSnapshot(readingsQuery, (snapshot) => {
//         const readings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setData(readings);
//       });

//       // Cleanup the listener on unmount
//       return () => unsubscribe();
//     };

//     fetchData();
//   }, []);

//   console.log(data);

//   if (data.length===0) return;
  

//   const {
//     active_energy,
//     active_power,
//     current,
//     frequency,
//     id,
//     power_factor,s
//     timestamp,
//     voltage
//   } = data[0];

//   console.log(current, frequency, timestamp);

//   async function handleShowData(date){
//     setChartIsLoading(true);
//     const energyUsageData = await computeEnergyUsage(getSortedEnergyUsage(date, userMeter.id), tariffRate);
//     setdatedEneryUsage(energyUsageData);
//     setChartIsLoading(false);
//   }


//   if (!active_energy) return <div>Loading...</div>

//     return (
//         <>


//           <Hero displayName={user.displayName} />

//           {/* Stats */}
//           <Box
//             width={"100%"}
//           >
//             <Flex
//               m={"auto"}
//               w={"80%"}
//               p={"50px 0px"}
//               justifyContent={"space-between"}
//               alignItems={"center"}
//               gap={"20px"}
//             >

// <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Meter No</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{userMeter ? userMeter.data().meter_no : "Meter"}</StatNumber>
//                     <StatHelpText>{userMeterDateCreated}</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"increase"} />
//                     Activated
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Voltage</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{voltage} V</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Current</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{current} A</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Active Power</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{active_power} W</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Active Energy</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{active_energy} W</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Frequency</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{frequency}Hz</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Power Factor</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>{power_factor}</StatNumber>
//                     <StatHelpText>updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>
                
//               </Stat>


//               <Stat
//                 boxShadow={"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}
//                 p={"4"}
//                 borderRadius={"10px"}
//                 gap={"20px"}
//               >
//                 <StatLabel fontSize={""}>Tariff</StatLabel>
                
//                 <Flex
//                   alignItems={"flex-end"}
//                   gap={"10px"}
//                 >
//                   <Box>
//                     <StatNumber fontSize={"x-large"}>₦ {active_energy * tariffRate}</StatNumber>
//                     <StatHelpText>Updated every 7secs</StatHelpText>
//                   </Box>
                  

//                   <StatHelpText>
//                     <StatArrow type={"decrease"} />
//                     23.36%
//                   </StatHelpText>
//                 </Flex>       
//               </Stat>          
//             </Flex>
//           </Box>
          

//           <Banner handleShowData={handleShowData} chartIsLoading={chartIsLoading}/>
//           <DataDisplay data={datedEneryUsage}/>
//           <OverviewSection />
//         </>
//     )
// }



import { Box, Flex, SimpleGrid, Stack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, chakra, useRadio } from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUserMeter, getUserMeterReadingCollectionRef, getConfig, computeEnergyUsage, getSortedEnergyUsage, powerToEnergy, db } from "../../Utils/Firebase";
import { Timestamp, collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { thousandSeperator } from "../../Utils/Utils";
import Banner from "../../components/banner";
import OverviewSection from "../../components/overview";
import Hero from "../../components/hero";
import DataDisplay from "../../components/dataDisplay";
import "../../index";

export default function Home({ globalConfig }) {
  const [user, setUser] = useState({});
  const [userMeter, setUserMeter] = useState(null);
  const [userMeterDateCreated, setUserMeterDateCreated] = useState("");
  const [latestEnergyUsage, setlatestEnergyUsage] = useState(0.00);
  const [datedEneryUsage, setdatedEneryUsage] = useState(null);
  const [tariff, setTariff] = useState(0.00);
  const tariffRate = 200;
  const auth = getAuth();

  //chart
  const [chartIsLoading, setChartIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userMeter = await getUserMeter(user.uid);

        if (userMeter) {
          const userMeterCreated = userMeter.data().date_created;
          const ts = userMeterCreated * 1000;
          setUserMeter(userMeter);
          setUserMeterDateCreated(new Date(ts).toDateString());

          const unsub = onSnapshot(await getUserMeterReadingCollectionRef(user.uid), (query_snapshot) => {
            if (!query_snapshot.empty) {
              let latest_data = query_snapshot.docs.at(-1).data();
              computeEnergyUsage(getSortedEnergyUsage(null, userMeter.id), tariffRate)
                .then((finalSortedData) => {
                  console.log(finalSortedData, tariffRate);
                  setlatestEnergyUsage(Number(finalSortedData.totalEnergy).toFixed(2));
                  setTariff(Number(finalSortedData.totalTariff).toFixed(2));
                })
            }
          });
        }
      }
    })
  }, [])

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const readingsRef = collection(db, 'Meter', 'F2BdftS6GpAjEglZrzxf', 'MeterReadings');
      const readingsQuery = query(readingsRef, orderBy('timestamp', 'desc'), limit(2));

      const unsubscribe = onSnapshot(readingsQuery, (snapshot) => {
        const readings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(readings);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  if (data.length === 0) return null;

  console.log(data);

  const {
    active_energy,
    active_power,
    current,
    frequency,
    power_factor,
    timestamp,
    voltage
  } = data[0];

  const {
    active_energy: active_energy2,
    active_power: active_power2,
    current: current2,
    frequency: frequency2,
    power_factor: power_factor2,
    timestamp: timestamp2,
    voltage: voltage2
  } = data[1];

  console.log(voltage2);

  function calculatePercentageChange(oldValue, newValue) {
    // Input validation
    if (typeof oldValue !== 'number' || typeof newValue !== 'number') {
        throw new Error('Both inputs must be numbers');
    }

    // Handle edge cases
    if (oldValue === 0) {
        if (newValue === 0) return 0.00;
        return newValue > 0 ? 100 : -100;
    }

    try {
        // Calculate percentage difference
        const difference = newValue - oldValue;
        const percentageChange = (difference / oldValue) * 100;
        
        // Round to 2 decimal places
        return Math.round(percentageChange * 100) / 100;
    } catch (error) {
        console.error('Error calculating percentage change:', error);
        return 0;
    }
}


const voltageChange = calculatePercentageChange(voltage2, voltage);
const currentChange = calculatePercentageChange(current2, current);
const active_powerChange = calculatePercentageChange(active_power2, active_power);
const active_energyChange = calculatePercentageChange(active_energy2, active_energy);
const frequencyChange = calculatePercentageChange(frequency2, frequency);
const power_factorChange = calculatePercentageChange(power_factor2, power_factor);
const tariffChange = calculatePercentageChange(active_energy2*tariffRate, active_energy*tariffRate);

  async function handleShowData(date) {
    setChartIsLoading(true);
    const energyUsageData = await computeEnergyUsage(getSortedEnergyUsage(date, userMeter.id), tariffRate);
    setdatedEneryUsage(energyUsageData);
    setChartIsLoading(false);
  }

  const StatCard = ({ label, value, unit = "", updateText, change }) => (
    <Stat
      p={["4", "6"]}
      borderRadius="xl"
      bg="white"
      boxShadow="0px 4px 20px rgba(0, 0, 0, 0.05)"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)",
      }}
      fontSize={["sm", "md"]} 
      color="gray.600" 
      fontWeight="medium"
      fontFamily="Comfortaa, sans-serif"
    >
      <StatLabel
        fontSize={["sm", "md"]}
        color="gray.600"
        fontWeight="500"
        mb={2}
        // fontFamily="Comfortaa, sans-serif"
      >
        {label}
      </StatLabel>

      <Flex
        alignItems="flex-end"
        gap={["2", "3"]}
      >
        <Box>
          <StatNumber
            fontSize={["xl", "2xl"]}
            fontWeight="700"
            color="gray.800"
          >
            {value} {unit}
          </StatNumber>
          <StatHelpText
            fontSize={["xs", "sm"]}
            color="gray.500"
            mt={1}
          >
            {updateText}
          </StatHelpText>
        </Box>

        {(change>=0 || change<0) && (
          <StatHelpText
            display="flex"
            alignItems="center"
            color={change >= 0 ? "green.500" : "red.500"}
          >
            <StatArrow type={(Math.floor(change) >= 0) ? "increase" : "decrease"} />
            {Math.abs(change)}%
          </StatHelpText>
        )}
      </Flex>
    </Stat>
  );

  return (
    <Box bg="gray.50" minH="100vh">
      <Hero displayName={user.displayName} />

      {/* Stats Dashboard */}
      <Box
        width="full"
        px={[4, 6, 8]}
        py={[8, 12]}
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={[4, 6, 8]}
          mx="auto"
          maxW="1440px"
        >
          <StatCard
            label="Meter No"
            value={"Meter-01"}
            updateText={"20th Dec, 2024"}
          />

          <StatCard
            label="Voltage"
            value={voltage}
            unit="V"
            updateText="updated every 7secs"
            change={voltageChange}
          />

          <StatCard
            label="Current"
            value={current}
            unit="A"
            updateText="updated every 7secs"
            change={currentChange}
          />

          <StatCard
            label="Active Power"
            value={active_power}
            unit="W"
            updateText="updated every 7secs"
            change={active_powerChange}
          />

          <StatCard
            label="Active Energy"
            value={active_energy}
            unit="KW/hr"
            updateText="updated every 7secs"
            change={active_energyChange}
          />

          <StatCard
            label="Frequency"
            value={frequency}
            unit="Hz"
            updateText="updated every 7secs"
            change={frequencyChange}
          />

          <StatCard
            label="Power Factor"
            value={power_factor}
            updateText="updated every 7secs"
            change={power_factorChange}
          />

          <StatCard
            label="Tariff"
            value={`₦ ${(active_energy * tariffRate).toLocaleString()}`}
            // value={`₦ ${(tariff).toLocaleString()}`}
            updateText="Updated every 7secs"
            change={tariffChange}
          />
        </SimpleGrid>
      </Box>

      {/* Data Visualization Section */}
      <Box
        px={[4, 6, 8]}
        pb={8}
        maxW="1440px"
        mx="auto"
      >
        <Banner
          handleShowData={handleShowData}
          chartIsLoading={chartIsLoading}
        />
        <Box mt={8}>
          <DataDisplay data={datedEneryUsage} />
        </Box>
        <Box mt={8}>
          <OverviewSection />
        </Box>
      </Box>
    </Box>
  );
}