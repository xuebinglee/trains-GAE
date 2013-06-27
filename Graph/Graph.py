from Town import Town


class Graph():
    """Graph"""
    def __init__(self):
        self.__towns = []
        # set up initial towns and edges
        self.addTown('0')
        self.addTown('1')
        self.addTown('2')
        self.addOrUpdateEdge('0', '1', 5)
        self.addOrUpdateEdge('1', '2', 5)

    def addTown(self, townID):
        t = Town(townID)
        self.__towns.append(t)

    def deleteTown(self, townID):
        if townID not in self.__towns:
            raise Exception('Town does not exist.')
        self.__towns.remove(townID)

    def addOrUpdateEdge(self, originID, destinationID, distance):
        if originID not in self.__towns:
            raise Exception('Origin does not exist.')
        if destinationID not in self.__towns:
            raise Exception('Destination does not exist.')
        if distance <= 0:
            raise Exception('Distance must be non-negative.')
        origin = next(town for town in self.__towns if town == originID)
        origin.addOrUpdateEdge(destinationID, distance)

    def deleteEdge(self, originID, destinationID):
        if originID in self.__towns:
            origin = next(t for t in self.__towns if t == originID)
            origin.deleteEdge(destinationID)

    def __repr__(self):
        rep = ''
        for town in self.__towns:
            rep += str(town)
        if rep == '':
            return 'Empty'
        else:
            return rep
