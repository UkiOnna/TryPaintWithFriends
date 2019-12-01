using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TryToPaintOnline
{
    public static class RoomIdGenerator
    {
        private static HashSet<int> roomNumbers=new HashSet<int>();
        private static Random random = new Random();

        public static int GetRoomNumber()
        {
            var number=random.Next(1, 100000);
            while (roomNumbers.Contains(number))
            {
                number = random.Next(1, 100000);
            }
            roomNumbers.Add(number);
            return number;
        }

        public static void DeleteRoomNumber(int number)
        {
            roomNumbers.Remove(number);
        }
    }
}
